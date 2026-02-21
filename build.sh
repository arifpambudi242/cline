#!/usr/bin/env bash

set -e

# Clear the dist directory
rm -rf dist

# Package the extension
npx vsce package --allow-package-secrets sendgrid

# Move the packaged extension to the dist directory
mv cline*.vsix dist/cline.vsix