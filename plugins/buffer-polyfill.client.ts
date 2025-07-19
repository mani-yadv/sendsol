import { Buffer } from "buffer";

export default defineNuxtPlugin(() => {
    // Polyfill Buffer for browser environments
    if (typeof window !== "undefined") {
        window.Buffer = Buffer;
        globalThis.Buffer = Buffer;
    }
});
