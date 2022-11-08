import { Plugin } from 'rollup';
import {
    formatXML,
    getAllCacheXML
} from 'babel-plugin-panorama-all-in-jsx/xml.macro';
import { basename, join } from 'node:path';
import { writeFile } from 'fs-extra';

export function rollupPluginXML(options: {
    dir: string;
    resolvePath?: (filename: string) => string | undefined;
}): Plugin {
    return {
        name: 'rollup-plugin-xml',
        async generateBundle() {
            const cache = getAllCacheXML();
            for (const [filename, root] of Object.entries(cache)) {
                let outPath = '';
                if (options.resolvePath) {
                    outPath = options.resolvePath(filename) || '';
                }
                if (!outPath) {
                    outPath = join(
                        options.dir,
                        basename(filename).replace(/\.tsx?$/, '.xml')
                    );
                }
                await writeFile(outPath, formatXML(root));
            }
        }
    };
}
