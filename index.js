/* global Float32Array, Symbol, AudioNode, AudioParam */

var BaseAudioContext = require("base-audio-context");

var ConstantValues = (function(len) {
  var ConstantValues = new Float32Array(len);
  for (var i = 0; i < len; i++) {
    ConstantValues[i] = 1;
  }
  return ConstantValues;
})(128);

function ConstantSourceNode(audioContext, opts) {
  opts = opts || {};

  var bufferSource = audioContext.createBufferSource();
  var buffer = audioContext.createBuffer(1, ConstantValues.length, audioContext.sampleRate);
  var gain = audioContext.createGain();
  var offset = typeof opts.offset === "number" ? opts.offset : 1;
  var startFunc = bufferSource.start;

  gain.channelCount = 1;
  gain.channelCountMode = "explicit";
  gain.channelInterpretation = "discrete";
  gain.gain.value = offset;

  buffer.getChannelData(0).set(ConstantValues);

  bufferSource.buffer = buffer;
  bufferSource.loop = true;
  bufferSource.connect(gain);

  Object.defineProperties(bufferSource, {
    offset: {
      value: gain.gain,
      enumerable: true, writable: false, configurable: true
    },
    start: {
      value: function(when) {
        startFunc.call(bufferSource, when);
      },
      enumerable: false, writable: false, configurable: true
    },
    connect: {
      value: AudioNode.prototype.connect.bind(gain),
      enumerable: false, writable: false, configurable: true
    },
    disconnect: {
      value: AudioNode.prototype.disconnect.bind(gain),
      enumerable: false, writable: false, configurable: true
    }
  });

  return bufferSource;
}

ConstantSourceNode.polyfill = function() {
  if (BaseAudioContext && !BaseAudioContext.prototype.hasOwnProperty("createConstantSource")) {
    ConstantSourceNode.install();
  }
};

ConstantSourceNode.install = function() {
  Object.defineProperty(BaseAudioContext.prototype, "createConstantSource", {
    value: function() {
      return new ConstantSourceNode(this);
    },
    enumerable: false, writable: false, configurable: true
  });
};

if (typeof Symbol === "function" && typeof Symbol.hasInstance === "symbol") {
  Object.defineProperty(ConstantSourceNode, Symbol.hasInstance, {
    value: function(value) {
      return value instanceof AudioNode && value.offset instanceof AudioParam;
    }
  });
}

module.exports = ConstantSourceNode;
