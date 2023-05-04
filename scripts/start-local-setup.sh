#!/usr/bin/env bash
git clone https://github.com/matter-labs/local-setup.git
cd local-setup

rm -rf ./volumes
mkdir -p ./volumes
mkdir -p ./volumes/postgres ./volumes/geth ./volumes/zksync/env/dev ./volumes/zksync/data
touch ./volumes/zksync/env.env

docker-compose down -v
docker-compose pull
docker-compose up -d