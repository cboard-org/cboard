var OGVDecoderAudioOpusW = (() => {
  var _scriptDir =
    typeof document !== 'undefined' && document.currentScript
      ? document.currentScript.src
      : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return function(OGVDecoderAudioOpusW) {
    OGVDecoderAudioOpusW = OGVDecoderAudioOpusW || {};

    var a;
    a ||
      (a =
        typeof OGVDecoderAudioOpusW !== 'undefined'
          ? OGVDecoderAudioOpusW
          : {});
    var l, m;
    a.ready = new Promise(function(b, c) {
      l = b;
      m = c;
    });
    var q = a,
      t = Object.assign({}, a),
      u = 'object' == typeof window,
      w = 'function' == typeof importScripts,
      x = '',
      y,
      A,
      B,
      fs,
      C,
      D;
    if (
      'object' == typeof process &&
      'object' == typeof process.versions &&
      'string' == typeof process.versions.node
    )
      (x = w ? require('path').dirname(x) + '/' : __dirname + '/'),
        (D = () => {
          C || ((fs = require('fs')), (C = require('path')));
        }),
        (y = function(b, c) {
          D();
          b = C.normalize(b);
          return fs.readFileSync(b, c ? void 0 : 'utf8');
        }),
        (B = b => {
          b = y(b, !0);
          b.buffer || (b = new Uint8Array(b));
          return b;
        }),
        (A = (b, c, e) => {
          D();
          b = C.normalize(b);
          fs.readFile(b, function(d, f) {
            d ? e(d) : c(f.buffer);
          });
        }),
        1 < process.argv.length && process.argv[1].replace(/\\/g, '/'),
        process.argv.slice(2),
        process.on('unhandledRejection', function(b) {
          throw b;
        }),
        (a.inspect = function() {
          return '[Emscripten Module object]';
        });
    else if (u || w)
      w
        ? (x = self.location.href)
        : 'undefined' != typeof document &&
          document.currentScript &&
          (x = document.currentScript.src),
        _scriptDir && (x = _scriptDir),
        0 !== x.indexOf('blob:')
          ? (x = x.substr(0, x.replace(/[?#].*/, '').lastIndexOf('/') + 1))
          : (x = ''),
        (y = b => {
          var c = new XMLHttpRequest();
          c.open('GET', b, !1);
          c.send(null);
          return c.responseText;
        }),
        w &&
          (B = b => {
            var c = new XMLHttpRequest();
            c.open('GET', b, !1);
            c.responseType = 'arraybuffer';
            c.send(null);
            return new Uint8Array(c.response);
          }),
        (A = (b, c, e) => {
          var d = new XMLHttpRequest();
          d.open('GET', b, !0);
          d.responseType = 'arraybuffer';
          d.onload = () => {
            200 == d.status || (0 == d.status && d.response)
              ? c(d.response)
              : e();
          };
          d.onerror = e;
          d.send(null);
        });
    var aa = a.print || console.log.bind(console),
      E = a.printErr || console.warn.bind(console);
    Object.assign(a, t);
    t = null;
    var F;
    a.wasmBinary && (F = a.wasmBinary);
    var noExitRuntime = a.noExitRuntime || !0;
    'object' != typeof WebAssembly && G('no native wasm support detected');
    var H,
      I = !1,
      ba = 'undefined' != typeof TextDecoder ? new TextDecoder('utf8') : void 0,
      ca,
      J,
      K;
    function da() {
      var b = H.buffer;
      ca = b;
      a.HEAP8 = new Int8Array(b);
      a.HEAP16 = new Int16Array(b);
      a.HEAP32 = K = new Int32Array(b);
      a.HEAPU8 = J = new Uint8Array(b);
      a.HEAPU16 = new Uint16Array(b);
      a.HEAPU32 = new Uint32Array(b);
      a.HEAPF32 = new Float32Array(b);
      a.HEAPF64 = new Float64Array(b);
    }
    var ea,
      fa = [],
      ha = [],
      ia = [];
    function ja() {
      var b = a.preRun.shift();
      fa.unshift(b);
    }
    var L = 0,
      M = null,
      N = null;
    a.preloadedImages = {};
    a.preloadedAudios = {};
    function G(b) {
      if (a.onAbort) a.onAbort(b);
      b = 'Aborted(' + b + ')';
      E(b);
      I = !0;
      b = new WebAssembly.RuntimeError(
        b + '. Build with -s ASSERTIONS=1 for more info.'
      );
      m(b);
      throw b;
    }
    function ka() {
      return O.startsWith('data:application/octet-stream;base64,');
    }
    var O;
    O = 'ogv-decoder-audio-opus-wasm.wasm';
    if (!ka()) {
      var la = O;
      O = a.locateFile ? a.locateFile(la, x) : x + la;
    }
    function oa() {
      var b = O;
      try {
        if (b == O && F) return new Uint8Array(F);
        if (B) return B(b);
        throw 'both async and sync fetching of the wasm failed';
      } catch (c) {
        G(c);
      }
    }
    function pa() {
      if (!F && (u || w)) {
        if ('function' == typeof fetch && !O.startsWith('file://'))
          return fetch(O, { credentials: 'same-origin' })
            .then(function(b) {
              if (!b.ok) throw "failed to load wasm binary file at '" + O + "'";
              return b.arrayBuffer();
            })
            .catch(function() {
              return oa();
            });
        if (A)
          return new Promise(function(b, c) {
            A(
              O,
              function(e) {
                b(new Uint8Array(e));
              },
              c
            );
          });
      }
      return Promise.resolve().then(function() {
        return oa();
      });
    }
    function S(b) {
      for (; 0 < b.length; ) {
        var c = b.shift();
        if ('function' == typeof c) c(a);
        else {
          var e = c.u;
          'number' == typeof e
            ? void 0 === c.s
              ? qa(e)()
              : qa(e)(c.s)
            : e(void 0 === c.s ? null : c.s);
        }
      }
    }
    var T = [];
    function qa(b) {
      var c = T[b];
      c || (b >= T.length && (T.length = b + 1), (T[b] = c = ea.get(b)));
      return c;
    }
    var ra = [null, [], []],
      sa = {
        f: function() {
          G('');
        },
        e: function(b, c, e) {
          J.copyWithin(b, c, c + e);
        },
        c: function(b) {
          var c = J.length;
          b >>>= 0;
          if (2147483648 < b) return !1;
          for (var e = 1; 4 >= e; e *= 2) {
            var d = c * (1 + 0.2 / e);
            d = Math.min(d, b + 100663296);
            var f = Math;
            d = Math.max(b, d);
            f = f.min.call(f, 2147483648, d + ((65536 - (d % 65536)) % 65536));
            a: {
              try {
                H.grow((f - ca.byteLength + 65535) >>> 16);
                da();
                var g = 1;
                break a;
              } catch (h) {}
              g = void 0;
            }
            if (g) return !0;
          }
          return !1;
        },
        d: function() {
          return 0;
        },
        b: function() {},
        a: function(b, c, e, d) {
          for (var f = 0, g = 0; g < e; g++) {
            var h = K[c >> 2],
              ma = K[(c + 4) >> 2];
            c += 8;
            for (var P = 0; P < ma; P++) {
              var z = J[h + P],
                Q = ra[b];
              if (0 === z || 10 === z) {
                z = 1 === b ? aa : E;
                var n = Q;
                for (var p = 0, r = p + NaN, v = p; n[v] && !(v >= r); ) ++v;
                if (16 < v - p && n.buffer && ba)
                  n = ba.decode(n.subarray(p, v));
                else {
                  for (r = ''; p < v; ) {
                    var k = n[p++];
                    if (k & 128) {
                      var R = n[p++] & 63;
                      if (192 == (k & 224))
                        r += String.fromCharCode(((k & 31) << 6) | R);
                      else {
                        var na = n[p++] & 63;
                        k =
                          224 == (k & 240)
                            ? ((k & 15) << 12) | (R << 6) | na
                            : ((k & 7) << 18) |
                              (R << 12) |
                              (na << 6) |
                              (n[p++] & 63);
                        65536 > k
                          ? (r += String.fromCharCode(k))
                          : ((k -= 65536),
                            (r += String.fromCharCode(
                              55296 | (k >> 10),
                              56320 | (k & 1023)
                            )));
                      }
                    } else r += String.fromCharCode(k);
                  }
                  n = r;
                }
                z(n);
                Q.length = 0;
              } else Q.push(z);
            }
            f += ma;
          }
          K[d >> 2] = f;
          return 0;
        },
        g: function(b, c, e) {
          var d = H.buffer,
            f = new Uint32Array(d, b, c),
            g = [];
          if (0 !== b)
            for (b = 0; b < c; b++) {
              var h = f[b];
              d.slice
                ? ((h = d.slice(h, h + 4 * e)), (h = new Float32Array(h)))
                : ((h = new Float32Array(d, h, e)), (h = new Float32Array(h)));
              g.push(h);
            }
          a.audioBuffer = g;
        },
        h: function(b, c) {
          a.audioFormat = { channels: b, rate: c };
          a.loadedMetadata = !0;
        }
      };
    (function() {
      function b(f) {
        a.asm = f.exports;
        H = a.asm.i;
        da();
        ea = a.asm.q;
        ha.unshift(a.asm.j);
        L--;
        a.monitorRunDependencies && a.monitorRunDependencies(L);
        0 == L &&
          (null !== M && (clearInterval(M), (M = null)),
          N && ((f = N), (N = null), f()));
      }
      function c(f) {
        b(f.instance);
      }
      function e(f) {
        return pa()
          .then(function(g) {
            return WebAssembly.instantiate(g, d);
          })
          .then(function(g) {
            return g;
          })
          .then(f, function(g) {
            E('failed to asynchronously prepare wasm: ' + g);
            G(g);
          });
      }
      var d = { a: sa };
      L++;
      a.monitorRunDependencies && a.monitorRunDependencies(L);
      if (a.instantiateWasm)
        try {
          return a.instantiateWasm(d, b);
        } catch (f) {
          return (
            E('Module.instantiateWasm callback failed with error: ' + f), !1
          );
        }
      (function() {
        return F ||
          'function' != typeof WebAssembly.instantiateStreaming ||
          ka() ||
          O.startsWith('file://') ||
          'function' != typeof fetch
          ? e(c)
          : fetch(O, { credentials: 'same-origin' }).then(function(f) {
              return WebAssembly.instantiateStreaming(f, d).then(c, function(
                g
              ) {
                E('wasm streaming compile failed: ' + g);
                E('falling back to ArrayBuffer instantiation');
                return e(c);
              });
            });
      })().catch(m);
      return {};
    })();
    a.___wasm_call_ctors = function() {
      return (a.___wasm_call_ctors = a.asm.j).apply(null, arguments);
    };
    a._ogv_audio_decoder_init = function() {
      return (a._ogv_audio_decoder_init = a.asm.k).apply(null, arguments);
    };
    a._ogv_audio_decoder_process_header = function() {
      return (a._ogv_audio_decoder_process_header = a.asm.l).apply(
        null,
        arguments
      );
    };
    a._ogv_audio_decoder_process_audio = function() {
      return (a._ogv_audio_decoder_process_audio = a.asm.m).apply(
        null,
        arguments
      );
    };
    a._malloc = function() {
      return (a._malloc = a.asm.n).apply(null, arguments);
    };
    a._free = function() {
      return (a._free = a.asm.o).apply(null, arguments);
    };
    a._ogv_audio_decoder_destroy = function() {
      return (a._ogv_audio_decoder_destroy = a.asm.p).apply(null, arguments);
    };
    var U;
    N = function ta() {
      U || V();
      U || (N = ta);
    };
    function V() {
      function b() {
        if (!U && ((U = !0), (a.calledRun = !0), !I)) {
          S(ha);
          l(a);
          if (a.onRuntimeInitialized) a.onRuntimeInitialized();
          if (a.postRun)
            for (
              'function' == typeof a.postRun && (a.postRun = [a.postRun]);
              a.postRun.length;

            ) {
              var c = a.postRun.shift();
              ia.unshift(c);
            }
          S(ia);
        }
      }
      if (!(0 < L)) {
        if (a.preRun)
          for (
            'function' == typeof a.preRun && (a.preRun = [a.preRun]);
            a.preRun.length;

          )
            ja();
        S(fa);
        0 < L ||
          (a.setStatus
            ? (a.setStatus('Running...'),
              setTimeout(function() {
                setTimeout(function() {
                  a.setStatus('');
                }, 1);
                b();
              }, 1))
            : b());
      }
    }
    a.run = V;
    if (a.preInit)
      for (
        'function' == typeof a.preInit && (a.preInit = [a.preInit]);
        0 < a.preInit.length;

      )
        a.preInit.pop()();
    V();
    var W, X;
    function ua(b) {
      if (W && X >= b) return W;
      W && a._free(W);
      X = b;
      return (W = a._malloc(X));
    }
    var Y;
    'undefined' === typeof performance || 'undefined' === typeof performance.now
      ? (Y = Date.now)
      : (Y = performance.now.bind(performance));
    function Z(b) {
      var c = Y();
      b = b();
      a.cpuTime += Y() - c;
      return b;
    }
    a.loadedMetadata = !!q.audioFormat;
    a.audioFormat = q.audioFormat || null;
    a.audioBuffer = null;
    a.cpuTime = 0;
    Object.defineProperty(a, 'processing', {
      get: function() {
        return !1;
      }
    });
    a.init = function(b) {
      Z(function() {
        a._ogv_audio_decoder_init();
      });
      b();
    };
    a.processHeader = function(b, c) {
      var e = Z(function() {
        var d = b.byteLength,
          f = ua(d);
        new Uint8Array(H.buffer, f, d).set(new Uint8Array(b));
        return a._ogv_audio_decoder_process_header(f, d);
      });
      c(e);
    };
    a.processAudio = function(b, c) {
      var e = Z(function() {
        var d = b.byteLength,
          f = ua(d);
        new Uint8Array(H.buffer, f, d).set(new Uint8Array(b));
        return a._ogv_audio_decoder_process_audio(f, d);
      });
      c(e);
    };
    a.close = function() {};

    return OGVDecoderAudioOpusW.ready;
  };
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = OGVDecoderAudioOpusW;
else if (typeof define === 'function' && define['amd'])
  define([], function() {
    return OGVDecoderAudioOpusW;
  });
else if (typeof exports === 'object')
  exports['OGVDecoderAudioOpusW'] = OGVDecoderAudioOpusW;
