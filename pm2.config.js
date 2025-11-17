/**
 * PM2 配置文件
 * 
 * 使用方法:
 *   pm2 start pm2.config.js
 *   pm2 restart pm2.config.js
 *   pm2 stop pm2.config.js
 *   pm2 delete pm2.config.js
 */

module.exports = {
  apps: [
    {
      name: 'todo-backend',
      cwd: './backend',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './backend/logs/pm2-error.log',
      out_file: './backend/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
    {
      name: 'todo-frontend',
      cwd: './frontend',
      script: 'serve',
      args: 'dist -l 5173',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './frontend/logs/pm2-error.log',
      out_file: './frontend/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};

