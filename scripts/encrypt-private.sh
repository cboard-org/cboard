#!/bin/bash

echo "env = $1"
echo "gpg = $ENCRYPTION_KEY"
tar -czvf ./private_env_temp-$1.tar.gz ./.private/$1.js
openssl des3 -salt -in ./private_env_temp-$1.tar.gz -out ./env/$1.ssl -pass env:ENCRYPTION_KEY
rm -rf ./private_env_temp-$1.tar.gz