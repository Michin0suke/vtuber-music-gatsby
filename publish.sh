#!/bin/sh

cd `dirname $0`

mv -v ./public_production ./public_archive/`date +%Y%m%d_%H-%M-%S`

mv -v ./public ./public_production