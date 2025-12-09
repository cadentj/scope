#!/bin/bash
cd "$(dirname "$0")/../web" && pnpm build && pnpm wrangler pages deploy

