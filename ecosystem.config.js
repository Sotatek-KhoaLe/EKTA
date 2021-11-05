module.exports = {
  apps: [
    {
      name: 'EKTA',
      script: 'npm run start',
      error_file: './.pm2/err.log',
      out_file: './.pm2/out.log',
      args: 'one two',
      instances: 1, //'max'
      instance_var: 'INSTANCE_ID',
      exec_mode: 'fork',
      wait_ready: true,
      max_restarts: 5,
      autorestart: false,
      restart_delay: 5,
      watch: false,
      ignore_watch: ['./views', '/views', 'views'],
      vizion: true,
      max_memory_restart: '2G',
      env: {},
      env_dev: {
        NODE_ENV: 'dev',
        DEBUG: 'true',
      },
      env_test: {
        NODE_ENV: 'test',
        DEBUG: 'true',
      },
      env_prod: {
        NODE_ENV: 'prod',
        DEBUG: 'false',
      },
    },
  ],
};
