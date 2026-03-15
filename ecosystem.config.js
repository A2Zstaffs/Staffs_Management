module.exports = {
  apps: [
    {
      name: 'vms-backend',
      cwd: './VMS/server',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: '../../logs/backend-error.log',
      out_file: '../../logs/backend-out.log',
      max_memory_restart: '400M',
      restart_delay: 3000,
      watch: false
    },
    {
      name: 'vms-frontend',
      cwd: './VMS/Frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '../../logs/frontend-error.log',
      out_file: '../../logs/frontend-out.log',
      max_memory_restart: '400M',
      restart_delay: 3000,
      watch: false
    }
  ]
};
