/**
 * Polyfills that need to be available before any test modules are loaded.
 * This file runs via craco Jest's `setupFiles` (before the test framework).
 *
 * Note: undici is mocked via moduleNameMapper in package.json jest config,
 * so we no longer need ReadableStream / MessagePort polyfills here.
 */
const { TextDecoder, TextEncoder } = require('util');
if (!global.TextDecoder) global.TextDecoder = TextDecoder;
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
