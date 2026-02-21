#!/usr/bin/env bash

set -e

# Clear the dist directory
rm -rf dist

# Package the extension
npx vsce package --allow-package-secrets sendgrid --out ./dist/cline.vsix