module.exports = {
  async rewrites() {
    return [
      {
        source: '/deployments/:id/:path*', // 클라이언트가 요청하는 경로
        destination: 'http://demo-:id-front-service:3000/:path*', // 프록시할 대상 URL
      },
    ];
  },
};
