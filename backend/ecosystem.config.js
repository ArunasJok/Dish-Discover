module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'app.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'development',
          DEBUGG: process.env.DEBUGG || 'FALSE'
        },
        env_production: {
          NODE_ENV: 'production',
          DEBUGG: process.env.DEBUGG || 'FALSE'
        }
      }
    ]
  };