## Description
This repo is made for this [article](#) in which I explain how to setup local development environment that runs over HTTPS using [Caddy](https://caddyserver.com/docs/) as reverse-proxy server.

## Getting Started
### Prerequisites
> Please review [article](#) for the installation.
  * mkcert tool
  * caddy server (v2)

### Run Project
* Clone project
```bash
git clone https://github.com/devahmedshendy/dev-over-https-traditional-setup.git
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
