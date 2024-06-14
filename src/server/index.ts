import cors from "cors";
import express from "express";

declare global {
  var _azleInitCalled: boolean | undefined;
  var _azlePostUpgradeCalled: boolean | undefined;
}

export function initServer() {
  let app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/init-called", (_req, res) => {
    res.json(globalThis._azleInitCalled);
  });

  app.get("/post-upgrade-called", (_req, res) => {
    res.json(globalThis._azlePostUpgradeCalled);
  });

  return app.listen();
}
