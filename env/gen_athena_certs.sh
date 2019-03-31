#! /bin/bash

echo "generating PRODUCTION certs for the following hosts:"

COMMA_LIST="athena.choycreative.com,*.choycreative.com"

read -p "Are you sure? " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "cutting fresh TLS certs"
  docker run \
    -e CA_SUBJECT=choycreative.com \
    -e SSL_SUBJECT='*.choycreative.com' \
    -e SSL_DNS="$COMMA_LIST" \
    -v $PWD/env/certs:/certs \
    paulczar/omgwtfssl
fi
