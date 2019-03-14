#!/bin/bash

cd ..
docker run -it -p 8888:8888 -p 6006:6006 -v $PWD/sharedfolder:/root/sharedfolder \
  achoy/vision-talk:latest jupyter notebook --allow-root
