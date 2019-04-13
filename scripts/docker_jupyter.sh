#!/bin/bash

<<<<<<< HEAD
#docker run -it -p 8888:8888 -p 6006:6006 -v $PWD/sharedfolder:/root/sharedfolder \
#  achoy/vision-talk:latest jupyter notebook --allow-root

docker run -it -p 8888:8888 -p 6006:6006 -v $PWD/sharedfolder:/home/achoy/sharedfolder \
  achoy/vision-talk:latest3 jupyter notebook --ip=0.0.0.0 --allow-root
=======
docker run -it -p 8888:8888 -p 6006:6006 -v $PWD/sharedfolder:/root/sharedfolder \
  achoy/vision-talk:latest jupyter notebook --allow-root
>>>>>>> a62b549c15903eb2679932bbccbdd9b862e050cb
