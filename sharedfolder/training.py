from tensorflow.keras.callbacks import ModelCheckpoint
#from keras.utils import to_categorical
#from tensorflow.keras.callbacks import EarlyStopping

# train the model
checkpointer = ModelCheckpoint(filepath = 'model.weights.best.hdf5' , verbose =1 , save_best_only = True )
hist = model . fit(x_train, y_train, batch_size =32 , epochs =100 , validation_data = (x_valid, y_valid), callbacks = [checkpointer], verbose =2 , shuffle = True )
