module.exports = {
  apps : [{
    name: 'consumerJimp',
    script: './consumers/consumerJimp.js',
    watch: '.'
  }, {
    name: 'sendEmailLogin',
    script: './microservices/sendEmailLogin.js',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
