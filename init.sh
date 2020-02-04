#!/bin/bash
#
# Description:
#   This script is to setup caddy server for running 
# both node.js & vue.js apps locally over HTTPS (https://*.foo.bar)
#
#   - Create certificate authority 
#   - Create trusted certificate for *.foo.bar domain.
#   - Gant low-numbered port access to caddy server
# 

echo """
> Install local Certificate Authority
  mkcert -install
"""

mkcert -install

echo """
> Create trusted certificate for *.foo.bar domain
  mkcert "*.foo.bar"
"""

mkcert "*.foo.bar"

echo """
> Save generated certs under ./caddy/certs
  cp ./_wildcard.foo.bar.pem ./caddy/certs
  cp ./_wildcard.foo.bar-key.pem ./caddy/certs
"""

mv ./_wildcard.foo.bar.pem ./caddy/certs
mv ./_wildcard.foo.bar-key.pem ./caddy/certs


echo """
> Gant low-numbered port access to caddy server
  sudo setcap CAP_NET_BIND_SERVICE=+eip $(which caddy)
"""

sudo setcap CAP_NET_BIND_SERVICE=+eip $(which caddy)

echo """
> Please add the following to /etc/hosts
  127.0.0.1 backend.foo.bar frontend.foo.bar
"""

