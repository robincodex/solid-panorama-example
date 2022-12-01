import { Plugin, PluginContext } from 'rollup';
import {
    formatXML,
    getAllCacheXML,
    XMLFile
} from 'solid-panorama-all-in-jsx/xml.macro';
import { basename, join } from 'node:path';
import { writeFile } from 'fs-extra';

export function rollupPluginXML(options: {
    inputFiles: string[];
    dir: string;
    resolvePath?: (filename: string) => string | undefined;
}): Plugin {
    function findAndMergeXML(
        ctx: PluginContext,
        id: string,
        cache: Record<string, XMLFile>,
        list: Set<XMLFile>
    ): void {
        const info = ctx.getModuleInfo(id);
        const importedIds = info?.importedIds;
        if (!importedIds) {
            return;
        }

        for (const child of importedIds) {
            findAndMergeXML(ctx, child, cache, list);
        }

        if (cache[id]) {
            list.add(cache[id]);
        }
    }

    return {
        name: 'rollup-plugin-xml',
        async generateBundle() {
            const cache = getAllCacheXML();
            for (const filename of options.inputFiles) {
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
                const files = new Set<XMLFile>();
                findAndMergeXML(this, filename, cache, files);
                await writeFile(outPath, formatXML(Array.from(files.values())));
            }
        }
    };
}
