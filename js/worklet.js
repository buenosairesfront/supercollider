/* SuperCollider Lab · U-MA — AudioWorklet wrapper around SCDSP.Server (dsp.js is loaded first). */
class SCLabProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.server = new globalThis.SCDSP.Server(sampleRate);
    this.port.onmessage = e => {
      const d = e.data;
      if (Array.isArray(d)) d.forEach(m => this.server.handle(m)); else this.server.handle(d);
    };
  }
  process(inputs, outputs) {
    const out = outputs[0], inp = inputs[0] || [];
    const L = out[0], R = out[1] || out[0];
    this.server.process(L, R, inp[0], inp[1], L.length, currentTime);
    const ob = this.server.takeOutbox();
    if (ob.length) this.port.postMessage(ob);
    return true;
  }
}
registerProcessor('sclab', SCLabProcessor);
