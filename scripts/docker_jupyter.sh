#!/bin/bash

#docker run -it -p 8888:8888 -p 6006:6006 -v $PWD/sharedfolder:/root/sharedfolder \
#  achoy/vision-talk:latest jupyter notebook --allow-root

docker run -it -p 8888:8888 -p 6006:6006 -v $PWD/sharedfolder:/home/achoy/sharedfolder \
  achoy/vision-talk:latest3 jupyter notebook --ip=0.0.0.0 --allow-root
