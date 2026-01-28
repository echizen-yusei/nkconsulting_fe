module.exports = {
  apps: [
    {
      name: "nkconsulting_fe-production",
      script: "npm",
      args: "start",
      cwd: "/var/www/production/nkconsulting_fe/current",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
