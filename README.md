# scrum-tool-api
Simple tool for scrum ceremonies. Perfect for retrospective and planning meetings. 
Written in TypeScript, using WebSockets, Node and React.

[Link to the repository with client](https://github.com/pilotpirxie/scrum-tool-client)

### Features
* Quick and easy to use
* No registration required
* Responsive design
* Open source, funny avatars
* Use websocket or http polling as fallback

### Getting started
Install Nginx.
```shell
sudo apt update
sudo apt install nginx
sudo ufw allow 'Nginx HTTP'
sudo ufw enable
sudo ufw status
systemctl status nginx
```

Configure reverse proxy to point to the application.
```shell
# /etc/nginx/sites-available/default
server {
     listen [::]:80;
     listen 80;

     server_name yourdomainname.com;

     location / {
         proxy_pass http://localhost:3001;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection 'upgrade';
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;
    }
}
```

Check if configuration is ok and reload.
```shell
sudo nginx -t
sudo service nginx restart
```

Install Node and essentials required for some dependencies.
```shell
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

node -v
npm -v

sudo apt install build-essential
```

Install postgres, create new database and setup user.
```shell
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql.service
sudo -u postgres createuser --interactive
sudo -u postgres createdb scrumdb
sudo -u postgres psql
ALTER USER postgres PASSWORD 'mysecretpassword';
```

Install certbot and configure SSL.
```shell
sudo apt install python3-certbot-nginx
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'
sudo certbot --nginx -d yourdomainname.com
```

Install PM2 and start the application.
```shell
npm install yarn pm2 -g

# in project directory
yarn
pm2 install typescript
pm2 start app.ts

# OR without process manager
yarn prod
```

### License
```
MIT
```