module.exports = {
  apps: [
    {
      name: "auth-api",
      script: "server.js",
      instances: 1,
      env_production: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
