import { exec, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";

import esbuild from "esbuild";
import elmPlugin from "esbuild-plugin-elm";

const SRC_DIR = "src";
const OUT_DIR = "dist";

async function build() {
  const production = process.env.NODE_ENV === "production";
  const watch = !production;
  const buildOptions = getBuildOptions(production);

  try {
    checkOrCreateDirectory(OUT_DIR);
    if (watch) {
      const context = await esbuild.context(buildOptions);
      await context.watch();
    } else {
      await esbuild.build(buildOptions);
    }
  } catch (error: unknown) {
    console.error(error);
    process.exit(1);
  }
}

const servePlugin: esbuild.Plugin = {
  name: "serve",
  setup(build) {
    let server: ChildProcess;
    build.onStart(() => {
      server?.kill();
    });
    build.onEnd(() => {
      server = exec(`node ${path.resolve(OUT_DIR, "app.js")}`);
      server.on("error", (error) => console.error(error));
      server.stdout?.on("data", (data) => console.log(data));
      server.stderr?.on("data", (data) => console.error(data));
    });
  },
};

function getBuildOptions(production: boolean): esbuild.BuildOptions {
  return {
    platform: "node",
    entryPoints: { app: path.resolve(SRC_DIR, "app.ts") },
    bundle: true,
    outdir: OUT_DIR,
    sourcemap: !production && "inline",
    plugins: [
      ...(production ? [] : [servePlugin]),
      elmPlugin({
        debug: !production,
        optimize: production,
        clearOnWatch: false,
      }),
    ],
  };
}

function checkOrCreateDirectory(dirpath: string) {
  if (!existsSync(dirpath)) {
    mkdirSync(dirpath, { recursive: true });
  }

  if (!statSync(dirpath).isDirectory()) {
    throw new Error(`"${dirpath}" already exists and is not a directory.`);
  }
}

build().catch((error) => console.error(error));
