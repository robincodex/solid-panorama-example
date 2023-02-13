import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Plugin } from 'rollup';

const xmlFile = `<root>
    <scripts>
        <include src="file://{resources}/scripts/custom_game/panorama-polyfill.js" />
        <include src="file://{resources}/scripts/custom_game/#name#" />
    </scripts>
    <Panel hittest="false" >
    </Panel>
</root>
`;
export default function compatiblePanorama(options?: {}): Plugin {
    const exportsPositionsearch = `'use strict';`;
    return {
        name: 'compatible-panorama',
        async renderChunk(code, chunk, options) {
            const hasExp = chunk.exports.length > 0;
            if (hasExp) {
                // 给模块创建xml文件
                const xmlPath = join(
                    __dirname,
                    `../addon/content/solid-example/panorama/layout/custom_game/${chunk.fileName.replace(
                        '.js',
                        '.xml'
                    )}`
                );
                const content = xmlFile.replace('#name#', chunk.fileName);
                await writeFile(xmlPath, content);
            }

            // 把每行开头`require('./common.js');`换成空字符串
            code = code.replace(/^require\('\.\/common.js'\);/m, '');

            // 加入exports和模块加载
            const index = code.indexOf(exportsPositionsearch);
            if (index >= 0) {
                return (
                    code.slice(0, index + exportsPositionsearch.length) +
                    `${
                        hasExp
                            ? ` const exports = {}; GameUI.__loadModule('${chunk.fileName.replace(
                                  '.js',
                                  ''
                              )}', exports);`
                            : ''
                    } const require = GameUI.__require;` +
                    code.slice(index + exportsPositionsearch.length)
                );
            }
            return code;
        },
        resolveId(source, importer, options) {
            if (source.includes('@common')) {
                return source.replace(
                    /\@common\/(.*)/,
                    join(__dirname, '../src/common/$1.ts').replace(/\\/g, '/')
                );
            }
        }
    };
}
