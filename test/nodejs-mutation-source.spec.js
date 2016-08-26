import {NodeJsMutationEmulator} from '../src/nodejs-mutation-emulator';
import {IObserver} from '../src/observer';
import {jsdom} from 'jsdom';

describe("Mutation Source", function () {
  describe("Attributes", function () {
    it("doesn't raise mutation if attribute not changed", function () {
      var source = new NodeJsMutationEmulator(0);
      var dom = jsdom(undefined);

      let observer = {
      }

      var target = dom.createElement("div");

      target.setAttribute("foo", "moo");

      var callback = (records) => {
        wasCalled = true;
      }

      source.registerObserver({
        target: target,
        callback: callback
      });

      var wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);
    });

    it("does raise mutation after attribute is changed", function () {
      var source = new NodeJsMutationEmulator(0);
      var dom = jsdom(undefined);
      let observer = {}

      var target = dom.createElement("div");

      target.setAttribute("foo", "moo");

      var wasCalled;

      var callback = (records) => {
        wasCalled = true;
      }

      source.registerObserver({
        target: target,
        callback: callback
      });

      wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);

      wasCalled = false;
      target.setAttribute("foo", "boo");
      source.cycle();
      expect(wasCalled).toBe(true);

      wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);

      wasCalled = false;
      target.setAttribute("foo", "choo");
      source.cycle();
      expect(wasCalled).toBe(true);

    });
  });

  describe("Node Value", function () {
    it("doesn't raise mutation if nodeValue not changed", function () {
      var source = new NodeJsMutationEmulator(0);
      var dom = jsdom(undefined);
      let observer = {}

      var target = dom.createTextNode("foo");

      var callback = (records) => {
        wasCalled = true;
      }

      source.registerObserver({
        target: target,
        callback: callback
      });

      var wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);
    });

    it("does raise mutation after nodeValue is changed", function () {
      var source = new NodeJsMutationEmulator(0);
      var dom = jsdom(undefined);
      let observer = {}

      var target = dom.createTextNode("foo");

      var wasCalled;
      var callback = (records) => {
        wasCalled = true;
      }

      source.registerObserver({
        target: target,
        callback: callback
      });

      wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);

      wasCalled = false;
      target.nodeValue = "boo";
      source.cycle();
      expect(wasCalled).toBe(true);

      wasCalled = false;
      source.cycle();
      expect(wasCalled).toBe(false);

      wasCalled = false;
      target.nodeValue = "choo";
      source.cycle();
      expect(wasCalled).toBe(true);

    });

    it('does clean up targets that do not have observers', function () {
      const source = new NodeJsMutationEmulator(0);

      let target = jsdom(undefined).createTextNode("foo");

      source.registerObserver({ target });

      const foundTarget = source.observers.findIndex(o => o.target === target);
      expect(foundTarget).toBeGreaterThan(-1);

      source.observers.splice(foundTarget, 1);

      source.cycle();

      const targetNotInObserver = source.targets.find(t => t.target === target);
      expect(targetNotInObserver).toBe(undefined);
    });
  });
});
