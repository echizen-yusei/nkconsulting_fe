module.exports = {
  apps: [
    {
      name: "nkconsulting_fe-staging",
      script: "npm",
      args: "start",
      cwd: "/var/www/staging/nkconsulting_fe/current",
      env: {
        NODE_ENV: "staging",
        PORT: 4100,
      },
    },
  ],
};
