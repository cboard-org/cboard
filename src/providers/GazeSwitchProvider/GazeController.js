/**
 * GazeController: on-device eye/blink detection used as a virtual switch.
 *
 * Phase 1 of the eye-tracking feature. It runs Google MediaPipe FaceLandmarker
 * entirely in the browser (WASM/WebGPU) — no video ever leaves the device — and
 * turns a deliberate, sustained blink into a single "switch" activation. That
 * activation is what higher layers translate into a Cboard scanner selection.
 *
 * The perception model (FaceLandmarker + blendshapes) is the "local AI model"
 * that grounds the trigger. Later phases can swap in a calibrated gaze-point
 * model (ONNX Runtime Web / WebGPU) without changing this public interface.
 */

// Loaded from CDN at runtime so the WASM assets don't need to be bundled/copied
// by CRA. webpackIgnore keeps webpack from trying to resolve the URL at build.
const TASKS_VISION_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';
const WASM_BASE_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const FACE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

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
      const vision = await import(/* webpackIgnore: true */ TASKS_VISION_URL);
      const { FaceLandmarker, FilesetResolver } = vision;

      const filesetResolver =
        await FilesetResolver.forVisionTasks(WASM_BASE_URL);

      this.faceLandmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: FACE_MODEL_URL,
            delegate: 'GPU'
          },
          outputFaceBlendshapes: true,
          runningMode: 'VIDEO',
          numFaces: 1
        }
      );

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
