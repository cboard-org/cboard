#!/bin/bash

echo "Encrypting $1 private config file"
tar -czvf ./private_env_temp-$1.tar.gz ./.private/$1.js
gpg --batch --yes --no-tty  --passphrase=$ENCRYPTION_KEY --symmetric -o ./env/$1-private.gpg ./private_env_temp-$1.tar.gz
rm -rf ./private_env_temp-$1.tar.gz
echo "Done encryption to ./env/$1-private.gpg."