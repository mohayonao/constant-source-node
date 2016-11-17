"use strict";

require("run-with-mocha");

const assert = require("assert");
const ConstantSourceNode = require("..");

describe("ConstantSourceNode", () => {
  let audioContext;

  beforeEach(() => {
    audioContext = new global.AudioContext();
  });

  describe("constructor", () => {
    it("(audioContext: global.AudioContext)", () => {
      const node = new ConstantSourceNode(audioContext);

      assert(node instanceof global.AudioNode);
    });
  });
  describe("#offset", () => {
    it("get: AudioParam", () => {
      const node = new ConstantSourceNode(audioContext);

      assert(node.offset instanceof global.AudioParam);
    });
  });
});
