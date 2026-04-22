import { wrap } from "comlink";

const worker = new Worker(
    new URL("./db.worker.js", import.meta.url),
    { type: "module", name: "libsql-worker" }
)

/**@type {import("comlink").Remote<import("./db.worker").DB>} */
export const db = wrap(worker)
