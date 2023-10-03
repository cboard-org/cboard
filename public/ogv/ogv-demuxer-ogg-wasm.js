var OGVDemuxerOggW = (() => {
  var _scriptDir =
    typeof document !== 'undefined' && document.currentScript
      ? document.currentScript.src
      : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return function(OGVDemuxerOggW) {
    OGVDemuxerOggW = OGVDemuxerOggW || {};

    var a;
    a || (a = typeof OGVDemuxerOggW !== 'undefined' ? OGVDemuxerOggW : {});
    var h, k;
    a.ready = new Promise(function(b, c) {
      h = b;
      k = c;
    });
    var l = Object.assign({}, a),
      m = 'object' == typeof window,
      n = 'function' == typeof importScripts,
      p = '',
      q,
      r,
      t,
      fs,
      u,
      v;
    if (
      'object' == typeof process &&
      'object' == typeof process.versions &&
      'string' == typeof process.versions.node
    )
      (p = n ? require('path').dirname(p) + '/' : __dirname + '/'),
        (v = () => {
          u || ((fs = require('fs')), (u = require('path')));
        }),
        (q = function(b, c) {
          v();
          b = u.normalize(b);
          return fs.readFileSync(b, c ? void 0 : 'utf8');
        }),
        (t = b => {
          b = q(b, !0);
          b.buffer || (b = new Uint8Array(b));
          return b;
        }),
        (r = (b, c, d) => {
          v();
          b = u.normalize(b);
          fs.readFile(b, function(e, f) {
            e ? d(e) : c(f.buffer);
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
    else if (m || n)
      n
        ? (p = self.location.href)
        : 'undefined' != typeof document &&
          document.currentScript &&
          (p = document.currentScript.src),
        _scriptDir && (p = _scriptDir),
        0 !== p.indexOf('blob:')
          ? (p = p.substr(0, p.replace(/[?#].*/, '').lastIndexOf('/') + 1))
          : (p = ''),
        (q = b => {
          var c = new XMLHttpRequest();
          c.open('GET', b, !1);
          c.send(null);
          return c.responseText;
        }),
        n &&
          (t = b => {
            var c = new XMLHttpRequest();
            c.open('GET', b, !1);
            c.responseType = 'arraybuffer';
            c.send(null);
            return new Uint8Array(c.response);
          }),
        (r = (b, c, d) => {
          var e = new XMLHttpRequest();
          e.open('GET', b, !0);
          e.responseType = 'arraybuffer';
          e.onload = () => {
            200 == e.status || (0 == e.status && e.response)
              ? c(e.response)
              : d();
          };
          e.onerror = d;
          e.send(null);
        });
    a.print || console.log.bind(console);
    var w = a.printErr || console.warn.bind(console);
    Object.assign(a, l);
    l = null;
    var x;
    a.wasmBinary && (x = a.wasmBinary);
    var noExitRuntime = a.noExitRuntime || !0;
    'object' != typeof WebAssembly && y('no native wasm support detected');
    var z,
      A = !1;
    'undefined' != typeof TextDecoder && new TextDecoder('utf8');
    var B, C, D;
    function E() {
      var b = z.buffer;
      B = b;
      a.HEAP8 = new Int8Array(b);
      a.HEAP16 = new Int16Array(b);
      a.HEAP32 = D = new Int32Array(b);
      a.HEAPU8 = C = new Uint8Array(b);
      a.HEAPU16 = new Uint16Array(b);
      a.HEAPU32 = new Uint32Array(b);
      a.HEAPF32 = new Float32Array(b);
      a.HEAPF64 = new Float64Array(b);
    }
    var F,
      G = [],
      H = [],
      I = [];
    function aa() {
      var b = a.preRun.shift();
      G.unshift(b);
    }
    var J = 0,
      K = null,
      L = null;
    a.preloadedImages = {};
    a.preloadedAudios = {};
    function y(b) {
      if (a.onAbort) a.onAbort(b);
      b = 'Aborted(' + b + ')';
      w(b);
      A = !0;
      b = new WebAssembly.RuntimeError(
        b + '. Build with -s ASSERTIONS=1 for more info.'
      );
      k(b);
      throw b;
    }
    function M() {
      return N.startsWith('data:application/octet-stream;base64,');
    }
    var N;
    N = 'ogv-demuxer-ogg-wasm.wasm';
    if (!M()) {
      var O = N;
      N = a.locateFile ? a.locateFile(O, p) : p + O;
    }
    function P() {
      var b = N;
      try {
        if (b == N && x) return new Uint8Array(x);
        if (t) return t(b);
        throw 'both async and sync fetching of the wasm failed';
      } catch (c) {
        y(c);
      }
    }
    function ba() {
      if (!x && (m || n)) {
        if ('function' == typeof fetch && !N.startsWith('file://'))
          return fetch(N, { credentials: 'same-origin' })
            .then(function(b) {
              if (!b.ok) throw "failed to load wasm binary file at '" + N + "'";
              return b.arrayBuffer();
            })
            .catch(function() {
              return P();
            });
        if (r)
          return new Promise(function(b, c) {
            r(
              N,
              function(d) {
                b(new Uint8Array(d));
              },
              c
            );
          });
      }
      return Promise.resolve().then(function() {
        return P();
      });
    }
    function Q(b) {
      for (; 0 < b.length; ) {
        var c = b.shift();
        if ('function' == typeof c) c(a);
        else {
          var d = c.B;
          'number' == typeof d
            ? void 0 === c.v
              ? R(d)()
              : R(d)(c.v)
            : d(void 0 === c.v ? null : c.v);
        }
      }
    }
    var S = [];
    function R(b) {
      var c = S[b];
      c || (b >= S.length && (S.length = b + 1), (S[b] = c = F.get(b)));
      return c;
    }
    var T = {},
      ca = {
        f: function(b, c, d) {
          C.copyWithin(b, c, c + d);
        },
        d: function(b) {
          var c = C.length;
          b >>>= 0;
          if (2147483648 < b) return !1;
          for (var d = 1; 4 >= d; d *= 2) {
            var e = c * (1 + 0.2 / d);
            e = Math.min(e, b + 100663296);
            var f = Math;
            e = Math.max(b, e);
            f = f.min.call(f, 2147483648, e + ((65536 - (e % 65536)) % 65536));
            a: {
              try {
                z.grow((f - B.byteLength + 65535) >>> 16);
                E();
                var g = 1;
                break a;
              } catch (ea) {}
              g = void 0;
            }
            if (g) return !0;
          }
          return !1;
        },
        e: function(b, c, d, e) {
          b = T.C(b);
          c = T.A(b, c, d);
          D[e >> 2] = c;
          return 0;
        },
        a: function(b, c, d, e) {
          var f = z.buffer;
          a.audioPackets.push({
            data: f.slice
              ? f.slice(b, b + c)
              : new Uint8Array(new Uint8Array(f, b, c)).buffer,
            timestamp: d,
            discardPadding: e
          });
        },
        c: function(b, c) {
          function d(e) {
            for (var f = '', g = new Uint8Array(z.buffer); 0 != g[e]; e++)
              f += String.fromCharCode(g[e]);
            return f;
          }
          b && (a.videoCodec = d(b));
          c && (a.audioCodec = d(c));
          b = a._ogv_demuxer_media_duration();
          a.duration = 0 <= b ? b : NaN;
          a.loadedMetadata = !0;
        },
        b: function(b, c, d, e, f) {
          var g = z.buffer;
          a.videoPackets.push({
            data: g.slice
              ? g.slice(b, b + c)
              : new Uint8Array(new Uint8Array(g, b, c)).buffer,
            timestamp: d,
            keyframeTimestamp: e,
            isKeyframe: !!f
          });
        }
      };
    (function() {
      function b(f) {
        a.asm = f.exports;
        z = a.asm.g;
        E();
        F = a.asm.s;
        H.unshift(a.asm.h);
        J--;
        a.monitorRunDependencies && a.monitorRunDependencies(J);
        0 == J &&
          (null !== K && (clearInterval(K), (K = null)),
          L && ((f = L), (L = null), f()));
      }
      function c(f) {
        b(f.instance);
      }
      function d(f) {
        return ba()
          .then(function(g) {
            return WebAssembly.instantiate(g, e);
          })
          .then(function(g) {
            return g;
          })
          .then(f, function(g) {
            w('failed to asynchronously prepare wasm: ' + g);
            y(g);
          });
      }
      var e = { a: ca };
      J++;
      a.monitorRunDependencies && a.monitorRunDependencies(J);
      if (a.instantiateWasm)
        try {
          return a.instantiateWasm(e, b);
        } catch (f) {
          return (
            w('Module.instantiateWasm callback failed with error: ' + f), !1
          );
        }
      (function() {
        return x ||
          'function' != typeof WebAssembly.instantiateStreaming ||
          M() ||
          N.startsWith('file://') ||
          'function' != typeof fetch
          ? d(c)
          : fetch(N, { credentials: 'same-origin' }).then(function(f) {
              return WebAssembly.instantiateStreaming(f, e).then(c, function(
                g
              ) {
                w('wasm streaming compile failed: ' + g);
                w('falling back to ArrayBuffer instantiation');
                return d(c);
              });
            });
      })().catch(k);
      return {};
    })();
    a.___wasm_call_ctors = function() {
      return (a.___wasm_call_ctors = a.asm.h).apply(null, arguments);
    };
    a._ogv_demuxer_init = function() {
      return (a._ogv_demuxer_init = a.asm.i).apply(null, arguments);
    };
    a._ogv_demuxer_receive_input = function() {
      return (a._ogv_demuxer_receive_input = a.asm.j).apply(null, arguments);
    };
    a._ogv_demuxer_process = function() {
      return (a._ogv_demuxer_process = a.asm.k).apply(null, arguments);
    };
    a._ogv_demuxer_destroy = function() {
      return (a._ogv_demuxer_destroy = a.asm.l).apply(null, arguments);
    };
    a._ogv_demuxer_media_length = function() {
      return (a._ogv_demuxer_media_length = a.asm.m).apply(null, arguments);
    };
    a._ogv_demuxer_media_duration = function() {
      return (a._ogv_demuxer_media_duration = a.asm.n).apply(null, arguments);
    };
    a._ogv_demuxer_seekable = function() {
      return (a._ogv_demuxer_seekable = a.asm.o).apply(null, arguments);
    };
    a._ogv_demuxer_keypoint_offset = function() {
      return (a._ogv_demuxer_keypoint_offset = a.asm.p).apply(null, arguments);
    };
    a._ogv_demuxer_seek_to_keypoint = function() {
      return (a._ogv_demuxer_seek_to_keypoint = a.asm.q).apply(null, arguments);
    };
    a._ogv_demuxer_flush = function() {
      return (a._ogv_demuxer_flush = a.asm.r).apply(null, arguments);
    };
    a._malloc = function() {
      return (a._malloc = a.asm.t).apply(null, arguments);
    };
    a._free = function() {
      return (a._free = a.asm.u).apply(null, arguments);
    };
    var U;
    L = function da() {
      U || V();
      U || (L = da);
    };
    function V() {
      function b() {
        if (!U && ((U = !0), (a.calledRun = !0), !A)) {
          Q(H);
          h(a);
          if (a.onRuntimeInitialized) a.onRuntimeInitialized();
          if (a.postRun)
            for (
              'function' == typeof a.postRun && (a.postRun = [a.postRun]);
              a.postRun.length;

            ) {
              var c = a.postRun.shift();
              I.unshift(c);
            }
          Q(I);
        }
      }
      if (!(0 < J)) {
        if (a.preRun)
          for (
            'function' == typeof a.preRun && (a.preRun = [a.preRun]);
            a.preRun.length;

          )
            aa();
        Q(G);
        0 < J ||
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
    var W, X, Y;
    'undefined' === typeof performance || 'undefined' === typeof performance.now
      ? (Y = Date.now)
      : (Y = performance.now.bind(performance));
    function Z(b) {
      var c = Y();
      b = b();
      c = Y() - c;
      a.cpuTime += c;
      return b;
    }
    a.loadedMetadata = !1;
    a.videoCodec = null;
    a.audioCodec = null;
    a.duration = NaN;
    a.onseek = null;
    a.cpuTime = 0;
    a.audioPackets = [];
    Object.defineProperty(a, 'hasAudio', {
      get: function() {
        return a.loadedMetadata && a.audioCodec;
      }
    });
    Object.defineProperty(a, 'audioReady', {
      get: function() {
        return 0 < a.audioPackets.length;
      }
    });
    Object.defineProperty(a, 'audioTimestamp', {
      get: function() {
        return 0 < a.audioPackets.length ? a.audioPackets[0].timestamp : -1;
      }
    });
    a.videoPackets = [];
    Object.defineProperty(a, 'hasVideo', {
      get: function() {
        return a.loadedMetadata && a.videoCodec;
      }
    });
    Object.defineProperty(a, 'frameReady', {
      get: function() {
        return 0 < a.videoPackets.length;
      }
    });
    Object.defineProperty(a, 'frameTimestamp', {
      get: function() {
        return 0 < a.videoPackets.length ? a.videoPackets[0].timestamp : -1;
      }
    });
    Object.defineProperty(a, 'keyframeTimestamp', {
      get: function() {
        return 0 < a.videoPackets.length
          ? a.videoPackets[0].keyframeTimestamp
          : -1;
      }
    });
    Object.defineProperty(a, 'nextKeyframeTimestamp', {
      get: function() {
        for (var b = 0; b < a.videoPackets.length; b++) {
          var c = a.videoPackets[b];
          if (c.isKeyframe) return c.timestamp;
        }
        return -1;
      }
    });
    Object.defineProperty(a, 'processing', {
      get: function() {
        return !1;
      }
    });
    Object.defineProperty(a, 'seekable', {
      get: function() {
        return !!a._ogv_demuxer_seekable();
      }
    });
    a.init = function(b) {
      Z(function() {
        a._ogv_demuxer_init();
      });
      b();
    };
    a.receiveInput = function(b, c) {
      Z(function() {
        var d = b.byteLength;
        (W && X >= d) || (W && a._free(W), (X = d), (W = a._malloc(X)));
        var e = W;
        new Uint8Array(z.buffer, e, d).set(new Uint8Array(b));
        a._ogv_demuxer_receive_input(e, d);
      });
      c();
    };
    a.process = function(b) {
      var c = Z(function() {
        return a._ogv_demuxer_process();
      });
      b(!!c);
    };
    a.dequeueVideoPacket = function(b) {
      if (a.videoPackets.length) {
        var c = a.videoPackets.shift().data;
        b(c);
      } else b(null);
    };
    a.dequeueAudioPacket = function(b) {
      if (a.audioPackets.length) {
        var c = a.audioPackets.shift();
        b(c.data, c.discardPadding);
      } else b(null);
    };
    a.getKeypointOffset = function(b, c) {
      var d = Z(function() {
        return a._ogv_demuxer_keypoint_offset(1e3 * b);
      });
      c(d);
    };
    a.seekToKeypoint = function(b, c) {
      var d = Z(function() {
        return a._ogv_demuxer_seek_to_keypoint(1e3 * b);
      });
      d &&
        (a.audioPackets.splice(0, a.audioPackets.length),
        a.videoPackets.splice(0, a.videoPackets.length));
      c(!!d);
    };
    a.flush = function(b) {
      Z(function() {
        a.audioPackets.splice(0, a.audioPackets.length);
        a.videoPackets.splice(0, a.videoPackets.length);
        a._ogv_demuxer_flush();
      });
      b();
    };
    a.close = function() {};

    return OGVDemuxerOggW.ready;
  };
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = OGVDemuxerOggW;
else if (typeof define === 'function' && define['amd'])
  define([], function() {
    return OGVDemuxerOggW;
  });
else if (typeof exports === 'object')
  exports['OGVDemuxerOggW'] = OGVDemuxerOggW;
