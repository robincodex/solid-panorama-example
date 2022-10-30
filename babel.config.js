module.exports = {
    targets: 'node 8.2',
    comments: false,
    presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        [
            'babel-preset-solid',
            {
                moduleName: '@solid-panorama/runtime',
                generate: 'universal'
            }
        ]
    ],
    plugins: ['@babel/plugin-transform-typescript']
};
