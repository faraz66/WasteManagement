module.exports = {
  apps: [
    {
      name: 'user-service',
      script: './backend/user-service/server.js',
      cwd: '/var/www/ecocircle',
      env: { NODE_ENV: 'production', PORT: 3001 },
      error_file: './logs/user-service-error.log',
      out_file: './logs/user-service-out.log',
      log_file: './logs/user-service-combined.log'
    },
    {
      name: 'marketplace-service',
      script: './backend/marketplace-service/server.js',
      cwd: '/var/www/ecocircle',
      env: { NODE_ENV: 'production', PORT: 3002 },
      error_file: './logs/marketplace-service-error.log',
      out_file: './logs/marketplace-service-out.log',
      log_file: './logs/marketplace-service-combined.log'
    },
    {
      name: 'educational-content-service',
      script: './backend/educational-content-service/server.js',
      cwd: '/var/www/ecocircle',
      env: { NODE_ENV: 'production', PORT: 3003 },
      error_file: './logs/educational-content-service-error.log',
      out_file: './logs/educational-content-service-out.log',
      log_file: './logs/educational-content-service-combined.log'
    },
    {
      name: 'community-service',
      script: './backend/community-service/server.js',
      cwd: '/var/www/ecocircle',
      env: { NODE_ENV: 'production', PORT: 3004 },
      error_file: './logs/community-service-error.log',
      out_file: './logs/community-service-out.log',
      log_file: './logs/community-service-combined.log'
    }
  ]
};
