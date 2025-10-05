
import { defineConfig } from 'tsdown';

export const input = [
    'src/index.ts',
    'src/react/index.ts',
    'src/url/index.ts',
    'src/rsc/index.ts',
    // 'src/url/adapters/index.ts',
    // 'src/rsc/index.ts',
    // 'src/devtools/index.ts',
];

export default defineConfig({
    target: ['node18', 'es2017'],
    entry: input,
    dts: {
        sourcemap: true,
        tsconfig: './tsconfig.build.json',
    },
    unbundle: true,
    format: ['cjs', 'esm'],
    outExtensions: (ctx) => ({
        dts: ctx.format === 'cjs' ? '.d.cts' : '.d.mts',
        js: ctx.format === 'cjs' ? '.cjs' : '.mjs',
    }),
});