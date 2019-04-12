
from tensorflow.keras.models import Sequential
#from tensorflow.keras import backend
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
model = Sequential()
# a - first CONV + POOL layers
# note that we need to define the input_shape in the first CONV layer only
model . add(Conv2D(filters =16 , kernel_size =2 , padding = 'same' , activation = 'relu' , input_shape = ( 32 , 32 , 3 )))
model . add(MaxPooling2D(pool_size =2 ))
# b - second CONV + POOL layers with RELU activation function
model . add(Conv2D(filters =32 , kernel_size =2 , padding = 'same' , activation = 'relu' ))
model . add(MaxPooling2D(pool_size =2 ))
# c - third CONV + POOL layers
model . add(Conv2D(filters =64 , kernel_size =2 , padding = 'same' , activation = 'relu' ))
model . add(MaxPooling2D(pool_size =2 ))
# d - dropout layer to avoid overfitting with 30% rate
model . add(Dropout( 0.3 ))
# e - flatten the last feature map into a vector of features
model . add(Flatten())
# f - add the first FC layer
model . add(Dense( 500 , activation = 'relu' ))
# g - another dropout layer 40% rate
model . add(Dropout( 0.4 ))
# h - Output layer is a FC layer with 10 nodes and softmax activation to give probabilities to the 10 classes we have
model . add(Dense( 10 , activation = 'softmax' ))
# i - print a summary of the model architecture
model . summary()

# compile the model
model . compile(loss = 'sparse_categorical_crossentropy' , optimizer = 'rmsprop' , metrics = [ 'accuracy' ])
