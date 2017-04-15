(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ConstantSourceNode = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"base-audio-context":2}],2:[function(require,module,exports){
(function (global){
var AudioContext = global.AudioContext || global.webkitAudioContext;
var OfflineAudioContext = global.OfflineAudioContext || global.webkitOfflineAudioContext;
var BaseAudioContext = global.BaseAudioContext || (OfflineAudioContext && Object.getPrototypeOf(OfflineAudioContext));

module.exports = (typeof BaseAudioContext === "function" && BaseAudioContext.prototype) ? BaseAudioContext : AudioContext;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});