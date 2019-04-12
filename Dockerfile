FROM achoy/vision-core:latest

MAINTAINER Albert Choy <albert@choycreative.com>

ARG HOST_UID=${HOST_UID:-4000}
ARG HOST_USER=${HOST_USER:-nodummy}

#RUN [ "${HOST_USER}" == "root" ] || \
#    (adduser -h /home/${HOST_USER} -D -u ${HOST_UID} ${HOST_USER} \
#    && chown -R "${HOST_UID}:${HOST_UID}" /home/${HOST_USER})
#RUN [ "${HOST_USER}" == "root" ] || \
#    (useradd -m -u ${HOST_UID} ${HOST_USER} \
#    && chown -R "${HOST_UID}:${HOST_UID}" /home/${HOST_USER})
RUN useradd -m -u ${HOST_UID} ${HOST_USER} && chown -R "${HOST_UID}:${HOST_UID}" /home/${HOST_USER}


# Run ipykernel
RUN python3 -m ipykernel.kernelspec

# Install TensorFlow
RUN pip3 --no-cache-dir install tensorflow==2.0.0-alpha0

# Install Keras
RUN pip3 --no-cache-dir install keras

# Install matplotlib
RUN pip3 install matplotlib

# Install jupyter
RUN pip3 install jupyter

# Set up notebook config
COPY docker/jupyter_notebook_config.py /root/.jupyter/

# Jupyter has issues with being run directly: https://github.com/ipython/ipython/issues/7062
COPY scripts/run_jupyter.sh /root/

# Expose Ports for TensorBoard (6006), Ipython (8888)
EXPOSE 6006 8888

#WORKDIR "/root"

USER ${HOST_USER}
WORKDIR /home/${HOST_USER}
CMD ["/bin/bash"]
