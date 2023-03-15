const { defineConfig } = require('@vue/cli-service');

module.exports = {
  // webpack-dev-server 相关配置
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Flask的端口
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', //通过pathRewrite重写地址，将前缀/api转为/
        },
      },
    },
  },
  lintOnSave: false,
};
