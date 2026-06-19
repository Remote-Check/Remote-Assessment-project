// Polyfill to mock ESM remote imports for tests
import { plugin } from "bun";

plugin({
  name: "esm-sh-mock",
  setup(build) {
    build.onResolve({ filter: /^https:\/\/esm\.sh\// }, args => {
      return {
        path: args.path,
        namespace: "esm-sh-mock",
      };
    });

    build.onLoad({ filter: /.*/, namespace: "esm-sh-mock" }, args => {
      if (args.path.includes("supabase-js")) {
        return {
          contents: `export const createClient = () => ({});`,
          loader: "js",
        };
      }
      if (args.path.includes("jspdf")) {
        return {
          contents: `export const jsPDF = class jsPDF {};`,
          loader: "js",
        };
      }
      if (args.path.includes("std@0.198.0/encoding/base64")) {
         return {
           contents: `export const encode = () => ""; export const decode = () => new Uint8Array();`,
           loader: "js"
         }
      }
      return {
        contents: `export default {};`,
        loader: "js",
      };
    });
  },
});
