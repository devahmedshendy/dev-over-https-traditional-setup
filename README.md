## Description
This repo is made for this [article](https://rebrand.ly/dev-over-https-traditional-setup-article) in which I explain how to setup local development environment that runs over HTTPS using [Caddy](https://caddyserver.com/docs/) as reverse-proxy server.

This project is demostrating running two apps one as frontend and the other as backend behind Caddy server which reverse proxy requests to them, locally over HTTPS.

It is a simple Todo app with one page, in which everything is opened for guest user, but once guest add/delete/etc... any task, a 401 will be raisd by the backend. Then `authenticate` the guest will make him able to perform operations on tasks.

Backend app is made by `node.js`, and frontend one by `vue.js`.

----
## Getting Started
### Prerequisites
  * **Ubuntu 18.04**
  * [mkcert](https://github.com/FiloSottile/mkcert#installation)
  * [caddy server (v2_beta13)](https://github.com/caddyserver/caddy/releases/tag/v2.0.0-beta.13)
  * [node.js (>12.14.0)](https://nodejs.org/en/download/)
  * [vue.js (>2.6.10)](https://cli.vuejs.org/guide/installation.html)

### Run Project
* Clone project
```bash
git clone https://github.com/devahmedshendy/dev-over-https-traditional-setup.git
```

* Generate Local Trusted Certificate for ***.foo.bar** domain
```bash
./init.sh
```

* Install backend dependencies and run it
> - Open new terminal.  
> - Switch to dev-over-https-traditional-setup/backend.
```bash
npm install

npm run dev
```

* Install frontend dependencies and run it  
> - Open new terminal.  
> - Switch to dev-over-https-traditional-setup/frontend.
```bash
npm install

npm run serve
```

* Start Caddy server
> - Open new terminal.  
> - Switch to dev-over-https-traditional-setup/caddy.
```bash
caddy run
```

----
Now project is ready. You can access it from browser.  

Also check following video for recorded demo of this project demonstrating a simple useful use of cookies over HTTPS:

[![Youtube Demo For Local Dev Over HTTPS](https://img.youtube.com/vi/WL9sNlI3c40/0.jpg)](https://rebrand.ly/dev-over-https-traditional-setup-ydemo)

