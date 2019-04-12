#Block #1

import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

#Block #2
import keras
from keras.datasets import cifar10
(x_train, y_train), (x_test, y_test) = cifar10.load_data()

#Block #3 Visualize
fig = plt.figure(figsize = ( 20 , 5 ))
for i in range ( 36 ):
    ax = fig.add_subplot( 3 , 12 , i + 1 , xticks = [], yticks = [])
    ax.imshow(np.squeeze(x_train[i]))

# Image preprocessing
# rescale images by dividing the pixel values by 255 [0,255] --> [0,1]
x_train = x_train.astype( 'float32' ) /255
x_test = x_test.astype( 'float32' ) /255

# break training set into training and validation sets
(x_train, x_valid) = x_train[ 5000 :], x_train[: 5000 ]
(y_train, y_valid) = y_train[ 5000 :], y_train[: 5000 ]
# print shape of training set
print ( 'x_train shape:' , x_train.shape)
# print number of training, validation, and test images
print (x_train.shape[ 0 ], 'train samples' )
print (x_test.shape[ 0 ], 'test samples' )
print (x_valid.shape[ 0 ], 'validation samples' )

from keras.utils import np_utils
# one-hot encode the labels
num_classes = len (np.unique(y_train))
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)
