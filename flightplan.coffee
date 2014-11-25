plan = require 'flightplan'

server = "bechsmartly"

plan.target 'prod',
  host: '128.199.129.22',
  username: 'root',
  password: 'try2crack'
  agent: process.env.SSH_AUTH_SOCK

plan.local (local) ->
  local.log 'Run clean'
  local.exec "gulp clean"

  local.log 'Run build'
  local.exec "gulp build"

  local.log 'Copy build to remote'
  local.transfer "dist/build.zip", "/repositories/#{server}/"

plan.remote (remote) ->
  remote.log 'Extracting build contents'
  remote.exec "unzip -o /repositories/#{server}/dist/build.zip -d /repositories/#{server}/"

  remote.log 'Checking and creating data directories'
  remote.exec "if [ ! -d \"/repositories/#{server}/content/apps\" ]; then mkdir /repositories/#{server}/content/apps; fi"
  remote.exec "if [ ! -d \"/repositories/#{server}/content/images\" ]; then mkdir /repositories/#{server}/content/images; fi"
  remote.exec "if [ ! -d \"/repositories/#{server}/content/data\" ]; then mkdir /repositories/#{server}/content/data; fi"

  remote.log 'Cleaning up'
  remote.exec "rm -rf /repositories/#{server}/dist"

  remote.log 'Starting/restarting services'
  remote.exec "echo #{server} >> /repositories/servers; cat /repositories/servers | sort -u -o /repositories/servers"
  remote.exec "cp -f /repositories/#{server}/nginx.conf /etc/sites/#{server}-nginx.conf"
  remote.exec "if docker ps -a | grep #{server} > /dev/null; then docker stop #{server}; docker rm #{server}; fi"
  remote.exec "touch /var/cache/pagespeed/#{server}/cache.flush"
  remote.exec "chmod -R 777 /var/cache/pagespeed"
  remote.exec "docker run -d --name #{server} -v /repositories/#{server}:/data abhishek0/ghost"
  remote.exec "/repositories/deployment.rb"
