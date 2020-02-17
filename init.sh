#!/bin/bash
#
# Description:
#   Run this script before using project, as it does the following:
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
> Save generated certs under ./caddy/certs/
  mv ./_wildcard.foo.bar.pem ./caddy/certs/
  mv ./_wildcard.foo.bar-key.pem ./caddy/certs/
"""

mv ./_wildcard.foo.bar.pem ./caddy/certs/
mv ./_wildcard.foo.bar-key.pem ./caddy/certs/

if [ $(uname | tr '[:upper:]' '[:lower:]') == "linux" ] 
then
 echo """
  > Gant low-numbered port access to caddy server
    sudo setcap CAP_NET_BIND_SERVICE=+eip $(which caddy)
  """

  sudo setcap CAP_NET_BIND_SERVICE=+eip $(which caddy)
fi

echo """
> Please add the following to /etc/hosts
  127.0.0.1 backend.foo.bar frontend.foo.bar
"""

