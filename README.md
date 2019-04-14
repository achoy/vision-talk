# achoy/vision-talk

* Presentation: [@speakerdeck](https://speakerdeck.com/achoy/computer-vision-2019-presentation-number-tccc23)
* Twitter: [@askchoy](https://twitter.com/askchoy)
* Website: [choycreative.com](https://www.choycreative.com)

## Computer Vision Talk

Presented at this year's Twin Cities Code Camp Version #23:
https://twincitiescodecamp.com/#/events/23/talks

## Description

Every car company (from Tesla to BMW) is trying to build a self-driving car. One of the major components is computer vision. In this hour, we will look at convolutional neural networks and the latest in open source image processing libraries. Bring your laptop, a strong beverage, and join in the coding fun.

## What is here:
* Docker files to create achoy/vision-talk instance.
* Example code from presentation
* My continuing exploration into CNN, Keras, and autonomous vehicle development.

## To use this:

### Run Keras/Jupyter using premade docker instance.
This configuration assumes that docker is running and configured.

* Steps to pull in this repo and start instance.

```bash
git clone https://github.com/achoy/vision-talk.git
cd vision-talk
docker pull achoy/vision-talk:latest3
./scripts/docker_jupyter.sh
```

* Start a browser to run jupyter notebook locally

Follow the instruction in command prompt, note the $RUNTOKEN after token=$RUNTOKEN.

```browser
http://127.0.0.1:8888/?token=$RUNTOKEN
```

## References used in this presentation

[dl-docker from github/floydhub](https://github.com/floydhub/dl-docker)
