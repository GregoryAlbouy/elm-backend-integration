declare module "esbuild-plugin-elm" {
  import type esbuild from "esbuild";

  interface ElmPluginOptions {
    /**
     * Enable the time-travelling debugger
     * @default false
     */
    debug?: boolean;

    /**
     * Optimize the js output
     * @default NODE_ENV === 'production'
     */
    optimize?: boolean;

    /**
     * Specifiy an explicit path to the elm executable
     * @default 'node_modules/.bin/elm' || 'elm'
     */
    pathToElm?: string;

    /**
     * Clear the console before re-building on file changes
     * @default false
     */
    clearOnWatch?: boolean;

    /**
     * The current working directory/elm project root
     * @default './'
     */
    cwd?: string;
  }

  export default function (options?: ElmPluginOptions): esbuild.Plugin;
}
