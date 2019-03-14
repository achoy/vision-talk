## achoy/vision-talk
[Website](https://www.choycreative.com)

# Computer Vision Talk

## Run Keras/Jupyter using premade docker instance.
This configuration assumes that docker is running and configured.

* Steps to pull in this repo and start instance.

```bash
git clone https://github.com/achoy/vision-talk.git
cd vision-talk
docker pull achoy/vision-talk:latest
./docker_jupyter.sh
```

* Start a browser to run jupyter notebook locally

Follow the instruction in command prompt, note the $RUNTOKEN after token=$RUNTOKEN.

```browser
http://127.0.0.1:8888/?token=$RUNTOKEN
```

## References used in this presentation

*[dl-docker from github/floydhub](https://github.com/floydhub/dl-docker)
