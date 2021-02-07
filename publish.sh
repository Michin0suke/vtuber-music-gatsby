#!/bin/sh

cd `dirname $0`

rm -r ./public_archive/*

mv -v ./public_production ./public_archive/`date +%Y%m%d_%H-%M-%S`

cp -vR ./public ./public_production