const path = require('path')
module.exports = {
  apps: [
    {
      name: "server",
      // instances: "2",
      // exec_mode: "cluster",
      //watch:false,
      watch: ["server.js"],
      ignore_watch: ["node_modules", "client/img", "\\.git", "*.log"],
      time: true,
      log_date_format: "DD-MM-YYYY HH:mm Z",
      restart_delay: 1000,
      max_restarts: 2,
      // no_autorestart:true,
      watch_options: {
        usePolling: true,
        alwaysStat: true,
        useFsEvents: false
      },
      env: {
        "PORT": 4400,
        "NODE_ENV": "production"
      },
      script: path.join(__dirname, '/server.js')
    },

  ]
}