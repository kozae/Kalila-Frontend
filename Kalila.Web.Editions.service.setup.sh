#!/bin/bash
echo "stopping service"
systemctl stop Kalila.Web.Editions
echo "copying code"
cd /root/Kalila/next/frontend && python3 Kalila.Web.Editions.service.setup.py
echo "installing packages"
cd /root/Kalila/next/frontend-editions && yarn --network-timeout 100000
cd /root/Kalila/next/frontend-editions && yarn
echo "building application"
cd /root/Kalila/next/frontend-editions && yarn nx build editions-app --verbose
echo "starting service"
systemctl start Kalila.Web.Editions && journalctl -u Kalila.Web.Editions -f
