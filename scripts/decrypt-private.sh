#!/bin/bash

echo "Decrypting $1 private config gpg"
echo $ENCRYPTION_KEY | gpg -d --batch --yes --no-tty --passphrase-fd 0 --output ./env/$1-private.tar.gz ./env/$1-private.gpg
tar -xvzf ./env/$1-private.tar.gz
rm -rf ./env/$1-private.tar.gz
echo "Done decryption to ./.private/$1.js"