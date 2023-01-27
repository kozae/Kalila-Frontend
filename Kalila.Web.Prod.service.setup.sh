#!/bin/bash
echo "stopping service"
systemctl stop Kalila.Web.Prod
echo "copying code"
cd /root/Kalila/next/frontend && python3 Kalila.Web.Prod.service.setup.py
cp -fr /root/Kalila/next/frontend/prod.env /root/Kalila/next/frontend-prod/apps/kalila/.env
echo "installing packages"
cd /root/Kalila/next/frontend-prod && yarn --network-timeout 100000
cd /root/Kalila/next/frontend-prod && yarn
echo "building application"
# cd /root/Kalila/next/frontend-prod && yarn nx reset
cd /root/Kalila/next/frontend-prod && yarn nx build kalila --verbose
echo "starting service"
systemctl start Kalila.Web.Prod && journalctl -u Kalila.Web.Prod
