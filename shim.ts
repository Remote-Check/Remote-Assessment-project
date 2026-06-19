declare global {
  var Deno: any;
}
globalThis.Deno = {
  env: {
    get: () => '',
    set: () => {},
    delete: () => {}
  },
  test: async (name: string, fn: any) => {
    try {
      await fn();
      console.log(`PASS: ${name}`);
    } catch (e) {
      console.error(`FAIL: ${name}`);
      console.error(e);
      process.exitCode = 1;
    }
  }
};
