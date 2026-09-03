/**
 * GazeController: on-device eye/blink detection used as a virtual switch.
 *
 * Phase 1 of the eye-tracking feature. It runs Google MediaPipe FaceLandmarker
 * entirely in the browser (WASM/WebGL) — no video ever leaves the device — and
 * turns a deliberate, sustained blink into a single "switch" activation. That
 * activation is what higher layers translate into a Cboard scanner selection.
 *
 * The perception model (FaceLandmarker + blendshapes) is the "local AI model"
 * that grounds the trigger. Later phases can swap in a calibrated gaze-point
 * model (ONNX Runtime Web / WebGPU) without changing this public interface.
 */

import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { isPackagedApp } from '../../cordova-util';

// WASM runtime and model are self-hosted under public/mediapipe so the feature
// works offline and inside the Cordova-packaged app (no CDN, no cross-origin
// module loading). PUBLIC_URL matches how the app already loads OGV assets.
const ASSET_BASE = `${process.env.PUBLIC_URL || ''}/mediapipe`;
const WASM_BASE_URL = `${ASSET_BASE}/wasm`;
const FACE_MODEL_URL = `${ASSET_BASE}/face_landmarker.task`;

// Packaged apps serve assets over file:// (Android) or other non-web schemes
// that the Fetch API refuses, so MediaPipe's default fetch-based asset loading
// fails. XMLHttpRequest can still read the bundled files, so load them as
// ArrayBuffers and hand MediaPipe a blob URL / in-memory buffer instead.
function loadArrayBuffer(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      // file:// responses report status 0 on success.
      if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Failed to load ${url} (status ${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error(`Failed to load ${url}`));
    xhr.send();
  });
}

export const GAZE_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  NO_FACE: 'no-face',
  ERROR: 'error'
};

const DEFAULT_OPTIONS = {
  // Blendshape score (0..1) above which an eye is considered closed.
  blinkThreshold: 0.5,
  // How long both eyes must stay closed to count as a deliberate switch (ms).
  // Natural blinks are ~100-150ms, so this rejects them.
  dwellMs: 500,
  // Minimum gap between two activations to avoid double-fires (ms).
  cooldownMs: 900,
  // Preferred capture resolution. High-res (4K-capable) webcams give the model
  // a sharper eye region, which improves blink/So future gaze precision.
  video: { width: 1280, height: 720, facingMode: 'user' }
};

export default class GazeController {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.video = null;
    this.stream = null;
    this.faceLandmarker = null;
    this.rafId = null;
    this.lastVideoTime = -1;
    this.modelAssetBuffer = null;
    this._blobUrls = [];

    this.status = GAZE_STATUS.IDLE;
    this.eyesClosedSince = null;
    this.lastActivationAt = 0;
    this.triggeredThisClosure = false;

    // Consumers subscribe to these.
    this.onSwitch = () => {};
    this.onStatus = () => {};
    this.onProgress = () => {};
  }

  setOptions(options = {}) {
    this.options = { ...this.options, ...options };
  }

  _setStatus(status, detail) {
    if (this.status !== status) {
      this.status = status;
      this.onStatus(status, detail);
    }
  }

  async start(videoEl) {
    if (this.status === GAZE_STATUS.LOADING || this.faceLandmarker) return;
    this.video = videoEl;
    this._setStatus(GAZE_STATUS.LOADING);

    try {
      const filesetResolver =
        await FilesetResolver.forVisionTasks(WASM_BASE_URL);

      if (isPackagedApp()) {
        filesetResolver.wasmBinaryPath = await this._toBlobUrl(
          filesetResolver.wasmBinaryPath,
          'application/wasm'
        );
        if (!this.modelAssetBuffer) {
          this.modelAssetBuffer = new Uint8Array(
            await loadArrayBuffer(FACE_MODEL_URL)
          );
        }
      }

      this.faceLandmarker = await this._createLandmarker(filesetResolver);

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: this.options.video,
        audio: false
      });
      this.video.srcObject = this.stream;
      await this.video.play();

      this._setStatus(GAZE_STATUS.READY);
      this._loop();
    } catch (err) {
      this._setStatus(GAZE_STATUS.ERROR, err && err.message);
      this.stop();
    }
  }

  // Prefer the GPU (WebGL) delegate; fall back to CPU where GPU is unavailable
  // (some packaged WebViews), so init doesn't hard-fail.
  async _createLandmarker(filesetResolver) {
    const modelAsset = this.modelAssetBuffer
      ? { modelAssetBuffer: this.modelAssetBuffer }
      : { modelAssetPath: FACE_MODEL_URL };
    const options = (delegate) => ({
      baseOptions: { ...modelAsset, delegate },
      outputFaceBlendshapes: true,
      runningMode: 'VIDEO',
      numFaces: 1
    });

    try {
      return await FaceLandmarker.createFromOptions(
        filesetResolver,
        options('GPU')
      );
    } catch (gpuErr) {
      return FaceLandmarker.createFromOptions(filesetResolver, options('CPU'));
    }
  }

  async _toBlobUrl(url, type) {
    const buffer = await loadArrayBuffer(url);
    const blobUrl = URL.createObjectURL(new Blob([buffer], { type }));
    this._blobUrls.push(blobUrl);
    return blobUrl;
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.faceLandmarker) {
      try {
        this.faceLandmarker.close();
      } catch (e) {
        /* noop */
      }
      this.faceLandmarker = null;
    }
    if (this.video) {
      this.video.srcObject = null;
    }
    this._blobUrls.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
    this._blobUrls = [];
    this.eyesClosedSince = null;
    this.triggeredThisClosure = false;
    this.lastVideoTime = -1;
    this._setStatus(GAZE_STATUS.IDLE);
  }

  _loop = () => {
    if (!this.faceLandmarker || !this.video) return;

    if (this.video.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.video.currentTime;
      try {
        const result = this.faceLandmarker.detectForVideo(
          this.video,
          performance.now()
        );
        this._process(result);
      } catch (e) {
        /* transient frame errors are non-fatal */
      }
    }

    this.rafId = requestAnimationFrame(this._loop);
  };

  _process(result) {
    const blendshapes =
      result &&
      result.faceBlendshapes &&
      result.faceBlendshapes[0] &&
      result.faceBlendshapes[0].categories;

    if (!blendshapes) {
      this.eyesClosedSince = null;
      this.triggeredThisClosure = false;
      this.onProgress(0);
      this._setStatus(GAZE_STATUS.NO_FACE);
      return;
    }

    this._setStatus(GAZE_STATUS.READY);

    const left = this._score(blendshapes, 'eyeBlinkLeft');
    const right = this._score(blendshapes, 'eyeBlinkRight');
    const closedScore = (left + right) / 2;
    const eyesClosed = closedScore >= this.options.blinkThreshold;

    const now = performance.now();

    if (eyesClosed) {
      if (this.eyesClosedSince === null) {
        this.eyesClosedSince = now;
        this.triggeredThisClosure = false;
      }
      const heldMs = now - this.eyesClosedSince;
      this.onProgress(Math.min(1, heldMs / this.options.dwellMs));

      const cooledDown = now - this.lastActivationAt >= this.options.cooldownMs;
      if (
        !this.triggeredThisClosure &&
        heldMs >= this.options.dwellMs &&
        cooledDown
      ) {
        this.triggeredThisClosure = true;
        this.lastActivationAt = now;
        this.onSwitch();
      }
    } else {
      this.eyesClosedSince = null;
      this.triggeredThisClosure = false;
      this.onProgress(0);
    }
  }

  _score(categories, name) {
    const cat = categories.find((c) => c.categoryName === name);
    return cat ? cat.score : 0;
  }
}
