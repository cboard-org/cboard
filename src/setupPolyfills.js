/**
 * Polyfills that need to be available before any test modules are loaded.
 * This file runs via craco Jest's `setupFiles` (before the test framework).
 * Required by undici (via enzyme's cheerio dependency) running in jsdom/node env.
 */
const { TextDecoder, TextEncoder } = require('util');
if (!global.TextDecoder) global.TextDecoder = TextDecoder;
if (!global.TextEncoder) global.TextEncoder = TextEncoder;

// Web Streams API - available as Node built-ins since Node 16
try {
  const webStreams = require('stream/web');
  if (!global.ReadableStream) global.ReadableStream = webStreams.ReadableStream;
  if (!global.WritableStream) global.WritableStream = webStreams.WritableStream;
  if (!global.TransformStream)
    global.TransformStream = webStreams.TransformStream;
  if (!global.ReadableStreamBYOBReader)
    global.ReadableStreamBYOBReader = webStreams.ReadableStreamBYOBReader;
  if (!global.ReadableStreamDefaultReader)
    global.ReadableStreamDefaultReader = webStreams.ReadableStreamDefaultReader;
  if (!global.WritableStreamDefaultController)
    global.WritableStreamDefaultController =
      webStreams.WritableStreamDefaultController;
  if (!global.WritableStreamDefaultWriter)
    global.WritableStreamDefaultWriter = webStreams.WritableStreamDefaultWriter;
  if (!global.TransformStreamDefaultController)
    global.TransformStreamDefaultController =
      webStreams.TransformStreamDefaultController;
  if (!global.ByteLengthQueuingStrategy)
    global.ByteLengthQueuingStrategy = webStreams.ByteLengthQueuingStrategy;
  if (!global.CountQueuingStrategy)
    global.CountQueuingStrategy = webStreams.CountQueuingStrategy;
} catch (e) {
  // Node < 16 – ignore
}

// MessageChannel / MessagePort - required by undici
if (!global.MessagePort) {
  const workerThreads = require('worker_threads');
  if (!global.MessageChannel)
    global.MessageChannel = workerThreads.MessageChannel;
  global.MessagePort = workerThreads.MessagePort;
}
