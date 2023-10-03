(() => {
  var e = {
      506: e => {
        (e.exports = function _assertThisInitialized(e) {
          if (void 0 === e)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return e;
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      575: e => {
        (e.exports = function _classCallCheck(e, t) {
          if (!(e instanceof t))
            throw new TypeError('Cannot call a class as a function');
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      913: e => {
        function _defineProperties(e, t) {
          for (var r = 0; r < t.length; r++) {
            var o = t[r];
            (o.enumerable = o.enumerable || !1),
              (o.configurable = !0),
              'value' in o && (o.writable = !0),
              Object.defineProperty(e, o.key, o);
          }
        }
        (e.exports = function _createClass(e, t, r) {
          return (
            t && _defineProperties(e.prototype, t),
            r && _defineProperties(e, r),
            Object.defineProperty(e, 'prototype', { writable: !1 }),
            e
          );
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      754: e => {
        function _getPrototypeOf(t) {
          return (
            (e.exports = _getPrototypeOf = Object.setPrototypeOf
              ? Object.getPrototypeOf
              : function _getPrototypeOf(e) {
                  return e.__proto__ || Object.getPrototypeOf(e);
                }),
            (e.exports.__esModule = !0),
            (e.exports.default = e.exports),
            _getPrototypeOf(t)
          );
        }
        (e.exports = _getPrototypeOf),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      205: (e, t, r) => {
        var o = r(489);
        (e.exports = function _inherits(e, t) {
          if ('function' != typeof t && null !== t)
            throw new TypeError(
              'Super expression must either be null or a function'
            );
          (e.prototype = Object.create(t && t.prototype, {
            constructor: { value: e, writable: !0, configurable: !0 }
          })),
            Object.defineProperty(e, 'prototype', { writable: !1 }),
            t && o(e, t);
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      318: e => {
        (e.exports = function _interopRequireDefault(e) {
          return e && e.__esModule ? e : { default: e };
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      585: (e, t, r) => {
        var o = r(8).default,
          s = r(506);
        (e.exports = function _possibleConstructorReturn(e, t) {
          if (t && ('object' === o(t) || 'function' == typeof t)) return t;
          if (void 0 !== t)
            throw new TypeError(
              'Derived constructors may only return object or undefined'
            );
          return s(e);
        }),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      489: e => {
        function _setPrototypeOf(t, r) {
          return (
            (e.exports = _setPrototypeOf =
              Object.setPrototypeOf ||
              function _setPrototypeOf(e, t) {
                return (e.__proto__ = t), e;
              }),
            (e.exports.__esModule = !0),
            (e.exports.default = e.exports),
            _setPrototypeOf(t, r)
          );
        }
        (e.exports = _setPrototypeOf),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      8: e => {
        function _typeof(t) {
          return (
            (e.exports = _typeof =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function(e) {
                    return typeof e;
                  }
                : function(e) {
                    return e &&
                      'function' == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? 'symbol'
                      : typeof e;
                  }),
            (e.exports.__esModule = !0),
            (e.exports.default = e.exports),
            _typeof(t)
          );
        }
        (e.exports = _typeof),
          (e.exports.__esModule = !0),
          (e.exports.default = e.exports);
      },
      445: (e, t, r) => {
        'use strict';
        var o = r(318);
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = void 0);
        var s = o(r(575)),
          n = o(r(913)),
          a = o(r(539)),
          i = '1.8.9-20220406232920-cb5f7ff',
          u = {
            OGVDemuxerOggW: 'ogv-demuxer-ogg-wasm.js',
            OGVDemuxerWebMW: 'ogv-demuxer-webm-wasm.js',
            OGVDecoderAudioOpusW: 'ogv-decoder-audio-opus-wasm.js',
            OGVDecoderAudioVorbisW: 'ogv-decoder-audio-vorbis-wasm.js',
            OGVDecoderVideoTheoraW: 'ogv-decoder-video-theora-wasm.js',
            OGVDecoderVideoVP8W: 'ogv-decoder-video-vp8-wasm.js',
            OGVDecoderVideoVP8MTW: 'ogv-decoder-video-vp8-mt-wasm.js',
            OGVDecoderVideoVP9W: 'ogv-decoder-video-vp9-wasm.js',
            OGVDecoderVideoVP9SIMDW: 'ogv-decoder-video-vp9-simd-wasm.js',
            OGVDecoderVideoVP9MTW: 'ogv-decoder-video-vp9-mt-wasm.js',
            OGVDecoderVideoVP9SIMDMTW: 'ogv-decoder-video-vp9-simd-mt-wasm.js',
            OGVDecoderVideoAV1W: 'ogv-decoder-video-av1-wasm.js',
            OGVDecoderVideoAV1SIMDW: 'ogv-decoder-video-av1-simd-wasm.js',
            OGVDecoderVideoAV1MTW: 'ogv-decoder-video-av1-mt-wasm.js',
            OGVDecoderVideoAV1SIMDMTW: 'ogv-decoder-video-av1-simd-mt-wasm.js'
          },
          d = (function() {
            function OGVLoaderBase() {
              (0, s.default)(this, OGVLoaderBase),
                (this.base = this.defaultBase());
            }
            return (
              (0, n.default)(OGVLoaderBase, [
                { key: 'defaultBase', value: function defaultBase() {} },
                {
                  key: 'wasmSupported',
                  value: function wasmSupported() {
                    return a.default.wasmSupported();
                  }
                },
                {
                  key: 'scriptForClass',
                  value: function scriptForClass(e) {
                    return u[e];
                  }
                },
                {
                  key: 'urlForClass',
                  value: function urlForClass(e) {
                    var t = this.scriptForClass(e);
                    if (t) return this.urlForScript(t);
                    throw new Error('asked for URL for unknown class ' + e);
                  }
                },
                {
                  key: 'urlForScript',
                  value: function urlForScript(e) {
                    if (e) {
                      var t = this.base;
                      return (
                        void 0 === t ? (t = '') : (t += '/'),
                        t + e + '?version=' + encodeURIComponent(i)
                      );
                    }
                    throw new Error('asked for URL for unknown script ' + e);
                  }
                },
                {
                  key: 'loadClass',
                  value: function loadClass(e, t, r) {
                    var o = this;
                    r = r || {};
                    var s = this.getGlobal(),
                      n = this.urlForClass(e),
                      a = function classWrapper(t) {
                        return (
                          ((t = t || {}).locateFile = function(e) {
                            return 'data:' === e.slice(0, 5)
                              ? e
                              : o.urlForScript(e);
                          }),
                          (t.mainScriptUrlOrBlob =
                            o.scriptForClass(e) +
                            '?version=' +
                            encodeURIComponent(i)),
                          s[e](t)
                        );
                      };
                    'function' == typeof s[e]
                      ? t(a)
                      : this.loadScript(n, function() {
                          t(a);
                        });
                  }
                }
              ]),
              OGVLoaderBase
            );
          })();
        t.default = d;
      },
      713: (e, t, r) => {
        'use strict';
        var o = r(318);
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = void 0);
        var s = o(r(575)),
          n = o(r(913)),
          a = o(r(205)),
          i = o(r(585)),
          u = o(r(754));
        function _createSuper(e) {
          var t = (function _isNativeReflectConstruct() {
            if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ('function' == typeof Proxy) return !0;
            try {
              return (
                Boolean.prototype.valueOf.call(
                  Reflect.construct(Boolean, [], function() {})
                ),
                !0
              );
            } catch (e) {
              return !1;
            }
          })();
          return function _createSuperInternal() {
            var r,
              o = (0, u.default)(e);
            if (t) {
              var s = (0, u.default)(this).constructor;
              r = Reflect.construct(o, arguments, s);
            } else r = o.apply(this, arguments);
            return (0, i.default)(this, r);
          };
        }
        var d = new ((function(e) {
          (0, a.default)(OGVLoaderWorker, e);
          var t = _createSuper(OGVLoaderWorker);
          function OGVLoaderWorker() {
            return (
              (0, s.default)(this, OGVLoaderWorker), t.apply(this, arguments)
            );
          }
          return (
            (0, n.default)(OGVLoaderWorker, [
              {
                key: 'loadScript',
                value: function loadScript(e, t) {
                  importScripts(e), t();
                }
              },
              {
                key: 'getGlobal',
                value: function getGlobal() {
                  return self;
                }
              }
            ]),
            OGVLoaderWorker
          );
        })(o(r(445)).default))();
        t.default = d;
      },
      607: (e, t, r) => {
        'use strict';
        var o = r(318);
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = void 0);
        var s = new (o(r(172))).default(
          ['loadedMetadata', 'audioFormat', 'audioBuffer', 'cpuTime'],
          {
            init: function init(e, t) {
              this.target.init(t);
            },
            processHeader: function processHeader(e, t) {
              this.target.processHeader(e[0], function(e) {
                t([e]);
              });
            },
            processAudio: function processAudio(e, t) {
              this.target.processAudio(e[0], function(e) {
                t([e]);
              });
            }
          }
        );
        t.default = s;
      },
      172: (e, t, r) => {
        'use strict';
        var o = r(318);
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = void 0);
        var s = o(r(8)),
          n = o(r(575)),
          a = o(r(913)),
          i = o(r(713));
        r.g.OGVLoader = i.default;
        var u = (function() {
          function OGVWorkerSupport(e, t) {
            var r = this;
            (0, n.default)(this, OGVWorkerSupport),
              (this.propList = e),
              (this.handlers = t),
              (this.transferables = (function() {
                var e = new ArrayBuffer(1024),
                  t = new Uint8Array(e);
                try {
                  return (
                    postMessage({ action: 'transferTest', bytes: t }, [e]),
                    !e.byteLength
                  );
                } catch (e) {
                  return !1;
                }
              })()),
              (this.target = null),
              (this.sentProps = {}),
              (this.pendingEvents = []),
              (this.handlers.construct = function(e, t) {
                var o = e[0],
                  s = e[1];
                i.default.loadClass(o, function(e) {
                  e(s).then(function(e) {
                    for (r.target = e, t(); r.pendingEvents.length; )
                      r.handleEvent(r.pendingEvents.shift());
                  });
                });
              }),
              addEventListener('message', function(e) {
                r.workerOnMessage(e);
              });
          }
          return (
            (0, a.default)(OGVWorkerSupport, [
              {
                key: 'handleEvent',
                value: function handleEvent(e) {
                  var t = this;
                  this.handlers[e.action].call(this, e.args, function(r) {
                    r = r || [];
                    var o = {},
                      s = [];
                    t.propList.forEach(function(e) {
                      var r = t.target[e];
                      if (t.sentProps[e] !== r)
                        if (
                          ((t.sentProps[e] = r),
                          'duration' == e && isNaN(r) && isNaN(t.sentProps[e]))
                        );
                        else if ('audioBuffer' == e) {
                          if (((o[e] = r), r))
                            for (var n = 0; n < r.length; n++)
                              s.push(r[n].buffer);
                        } else
                          'frameBuffer' == e
                            ? ((o[e] = r),
                              r &&
                                (s.push(r.y.bytes.buffer),
                                s.push(r.u.bytes.buffer),
                                s.push(r.v.bytes.buffer)))
                            : (o[e] = r);
                    });
                    var n = {
                      action: 'callback',
                      callbackId: e.callbackId,
                      args: r,
                      props: o
                    };
                    t.transferables ? postMessage(n, s) : postMessage(n);
                  });
                }
              },
              {
                key: 'workerOnMessage',
                value: function workerOnMessage(e) {
                  var t = e.data;
                  t &&
                    'object' === (0, s.default)(t) &&
                    ('transferTest' == t.action ||
                      ('string' != typeof t.action ||
                      'string' != typeof t.callbackId ||
                      'object' !== (0, s.default)(t.args)
                        ? console.log('invalid message data', t)
                        : t.action in this.handlers
                        ? 'construct' == t.action || this.target
                          ? this.handleEvent(t)
                          : this.pendingEvents.push(t)
                        : console.log('invalid message action', t.action)));
                }
              }
            ]),
            OGVWorkerSupport
          );
        })();
        t.default = u;
      },
      539: (e, t, r) => {
        'use strict';
        var o = r(318);
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = void 0);
        var s = o(r(8)),
          n = o(r(575)),
          a = o(r(913));
        var i = new ((function() {
          function WebAssemblyChecker() {
            (0, n.default)(this, WebAssemblyChecker),
              (this.tested = !1),
              (this.testResult = void 0);
          }
          return (
            (0, a.default)(WebAssemblyChecker, [
              {
                key: 'wasmSupported',
                value: function wasmSupported() {
                  if (!this.tested) {
                    try {
                      'object' ===
                      ('undefined' == typeof WebAssembly
                        ? 'undefined'
                        : (0, s.default)(WebAssembly))
                        ? (this.testResult = (function testSafariWebAssemblyBug() {
                            var e = new Uint8Array([
                                0,
                                97,
                                115,
                                109,
                                1,
                                0,
                                0,
                                0,
                                1,
                                6,
                                1,
                                96,
                                1,
                                127,
                                1,
                                127,
                                3,
                                2,
                                1,
                                0,
                                5,
                                3,
                                1,
                                0,
                                1,
                                7,
                                8,
                                1,
                                4,
                                116,
                                101,
                                115,
                                116,
                                0,
                                0,
                                10,
                                16,
                                1,
                                14,
                                0,
                                32,
                                0,
                                65,
                                1,
                                54,
                                2,
                                0,
                                32,
                                0,
                                40,
                                2,
                                0,
                                11
                              ]),
                              t = new WebAssembly.Module(e);
                            return (
                              0 !==
                              new WebAssembly.Instance(t, {}).exports.test(4)
                            );
                          })())
                        : (this.testResult = !1);
                    } catch (e) {
                      console.log('Exception while testing WebAssembly', e),
                        (this.testResult = !1);
                    }
                    this.tested = !0;
                  }
                  return this.testResult;
                }
              }
            ]),
            WebAssemblyChecker
          );
        })())();
        t.default = i;
      }
    },
    t = {};
  function __webpack_require__(r) {
    var o = t[r];
    if (void 0 !== o) return o.exports;
    var s = (t[r] = { exports: {} });
    return e[r](s, s.exports, __webpack_require__), s.exports;
  }
  (__webpack_require__.g = (function() {
    if ('object' == typeof globalThis) return globalThis;
    try {
      return this || new Function('return this')();
    } catch (e) {
      if ('object' == typeof window) return window;
    }
  })()),
    (() => {
      'use strict';
      __webpack_require__(318)(__webpack_require__(607));
    })();
})();
