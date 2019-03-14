# same as before, we start with importing keras library
from keras.models import Sequential
# here we import a layer called Flatten to convert the image matrix into a vector
from keras.layers import Flatten
# define the model
model = Sequential()
# add the flatten layer - also known as the input layer
model.add( Flatten(input_shape = (28,28) )
