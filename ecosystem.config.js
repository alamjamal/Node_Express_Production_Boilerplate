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
        watch_options: {
          usePolling: true,
          alwaysStat: true,
          useFsEvents: false
        },
        env: {
          "PORT": 4400,
          "NODE_ENV": "production"
        },
        script: path.join(__dirname,'/server.js')
      },
  
    ]
  }