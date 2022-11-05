import rollupTypescript, {
    RollupTypescriptOptions
} from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path, { join } from 'node:path';
import babel from '@rollup/plugin-babel';
import { RollupWatchOptions } from 'rollup';
import chalk from 'chalk';
import { existsSync, readdirSync, statSync } from 'node:fs';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import compatiblePanorama from './plugins/compatible-panorama';

const cli_prefix = `[${chalk.magenta('Panorama')}]`;

function isDir(p: string) {
    return statSync(p).isDirectory();
}

export default function GetRollupWatchOptions(rootPath: string) {
    // 入口文件夹
    const Dirs = readdirSync(rootPath).filter(
        v =>
            isDir(path.join(rootPath, v)) &&
            v !== 'global' &&
            existsSync(path.join(rootPath, `${v}/${v}.ts`))
    );
    console.log(Dirs.map(v => cli_prefix + ' 👁️  ' + v).join('\n'));

    const options: RollupWatchOptions = {
        input: path.join(rootPath, `./app.tsx`),
        output: {
            sourcemap: false,
            dir: 'addon/content/solid-example/panorama/scripts/custom_game',
            format: 'cjs',
            entryFileNames: `[name].js`,
            chunkFileNames: `[name].js`,
            assetFileNames: `[name].[ext]`,
            manualChunks(id, api) {
                // const u = new URL(id, 'file:');
                if (id.search(/[\\/]common[\\/]/) >= 0) {
                    return 'common';
                }
                if (id.search(/[\\/]node_modules[\\/]/) >= 0) {
                    return 'libs';
                }
            }
        },
        plugins: [
            babel({
                comments: false,
                exclude: 'node_modules/**',
                extensions: ['.js', '.ts', '.tsx'],
                babelHelpers: 'bundled'
            }),
            alias({
                entries: [
                    {
                        find: '@common/(.*)',
                        replacement: join(__dirname, 'pages/common/$1.ts')
                    }
                ]
            }),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify('production')
                // 'process.env.NODE_ENV': JSON.stringify('development'),
            }),
            // rollupTypescript({
            //     tsconfig: path.join(rootPath, `tsconfig.json`)
            // }),
            commonjs(),
            nodeResolve(),
            compatiblePanorama()
        ]
    };

    return options;
}
