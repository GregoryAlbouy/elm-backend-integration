import { existsSync, mkdirSync, statSync } from "fs";
import path from "path";

import esbuild from "esbuild";
import elmPlugin from "esbuild-plugin-elm";

const SRC_DIR = "src";
const OUT_DIR = "dist";

async function build() {
  const production = process.env.NODE_ENV === "production";
  const buildOptions = getBuildOptions(production);

  try {
    checkOrCreateDirectory(OUT_DIR);
    await esbuild.build(buildOptions);
  } catch (error: unknown) {
    console.error(error);
    process.exit(1);
  }
}

function getBuildOptions(production: boolean): esbuild.BuildOptions {
  return {
    platform: "node",
    entryPoints: { app: path.resolve(SRC_DIR, "app.ts") },
    bundle: true,
    outdir: OUT_DIR,
    minify: production,
    sourcemap: !production && "inline",
    plugins: [
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
