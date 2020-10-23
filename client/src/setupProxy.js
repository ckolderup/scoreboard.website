const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${SERVER_HOST}:${SERVER_PORT}`,
      changeOrigin: true,
    })
  );
};
