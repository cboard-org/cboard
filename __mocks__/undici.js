'use strict';

/**
 * Minimal undici mock for Jest tests.
 * Prevents undici from initializing real HTTP machinery (MessagePort,
 * ReadableStream, etc.) which causes crashes in the jsdom test environment.
 * Tests never call fromURL() so no real HTTP implementation is needed.
 */

const noop = () => {};
const asyncNoop = async () => {};

class Dispatcher {}
class Client extends Dispatcher {}
class Pool extends Dispatcher {}
class BalancedPool extends Dispatcher {}
class RoundRobinPool extends Dispatcher {}
class Agent extends Dispatcher {}
class ProxyAgent extends Dispatcher {}
class EnvHttpProxyAgent extends Dispatcher {}
class RetryAgent extends Dispatcher {}
class H2CClient extends Dispatcher {}
class RetryHandler {}
class DecoratorHandler {}
class RedirectHandler {}
class WebSocket {}
class CloseEvent {}
class ErrorEvent {}
class MessageEvent {}

module.exports = {
  Dispatcher,
  Client,
  Pool,
  BalancedPool,
  RoundRobinPool,
  Agent,
  ProxyAgent,
  EnvHttpProxyAgent,
  RetryAgent,
  H2CClient,
  RetryHandler,
  DecoratorHandler,
  RedirectHandler,
  interceptors: {},
  cacheStores: {},
  buildConnector: noop,
  errors: {},
  util: {},
  setGlobalDispatcher: noop,
  getGlobalDispatcher: noop,
  fetch: asyncNoop,
  Headers: class Headers {},
  Response: class Response {},
  Request: class Request {},
  FormData: class FormData {},
  setGlobalOrigin: noop,
  getGlobalOrigin: noop,
  caches: {},
  deleteCookie: noop,
  getCookies: noop,
  getSetCookies: noop,
  setCookie: noop,
  parseCookie: noop,
  parseMIMEType: noop,
  serializeAMimeType: noop,
  WebSocket,
  CloseEvent,
  ErrorEvent,
  MessageEvent,
  ping: asyncNoop
};
