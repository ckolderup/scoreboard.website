const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
      changeOrigin: true,
    })
  );
};
