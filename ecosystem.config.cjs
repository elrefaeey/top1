/** PM2 process file for Hostinger VPS / Node.js hosting */
module.exports = {
  apps: [
    {
      name: "top1markting",
      cwd: __dirname,
      script: ".output/server/index.mjs",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
      },
    },
  ],
};
