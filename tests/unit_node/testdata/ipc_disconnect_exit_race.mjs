// Copyright 2018-2026 the Deno authors. MIT license.

import { fork, spawn } from "node:child_process";

if (process.env.DENO_CHILD_IPC_DISCONNECT_RACE === "1") {
  // Keep the inherited IPC socket and stderr pipe open briefly after the
  // forked child exits so the parent's teardown can race the IPC CLOSE.
  spawn("sleep", ["0.05"], {
    stdio: ["ignore", "ignore", "inherit"],
  }).unref();
  process.exit(0);
} else {
  for (let i = 0; i < 50; i++) {
    await new Promise((resolve, reject) => {
      const child = fork(new URL(import.meta.url).pathname, [], {
        stdio: "pipe",
        env: { ...process.env, DENO_CHILD_IPC_DISCONNECT_RACE: "1" },
      });
      child.once("error", reject);
      child.once("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`fork exited with ${code}`));
        }
      });
    });
  }
}
