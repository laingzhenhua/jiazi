const path = require("path");
function resolve(dir) {
    return path.join(__dirname, '.', dir);
}
module.exports = {
    // 基本路径
    publicPath: "./",
    // sourceMap
    productionSourceMap: false,
    devServer: {
        open: true,//配置自动启动浏览器
        // 配置多个代理
        proxy: {
            "/grid-srv-api": {
                target: "http://192.168.1.192:88/grid-srv-api",// 要访问的接口域名
                ws: true, // 是否启用websockets
                changeOrigin: true, //开启代理
                pathRewrite: {
                    "^/grid-srv-api": ""
                }
            }
        },
    },
    // webpack相关配置
    chainWebpack: (config) => {
        config.resolve.alias
            .set('vue$', 'vue/dist/vue.esm.js')
            .set('@', path.resolve(__dirname, './src'))
            .set("assets", path.resolve(__dirname, "./src/assets"));
        // 修复HMR
        config.resolve.symlinks(true);
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
    },
    css: {
        //是否使用css分离插件 ExtractTextPlugin
        extract:['production', 'test'].includes(process.env.NODE_ENV),
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
        },
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // 第三方插件配置
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: []
        }
    },
};
