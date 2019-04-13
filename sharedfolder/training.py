from tensorflow.keras.callbacks import ModelCheckpoint
#from keras.utils import to_categorical
#from tensorflow.keras.callbacks import EarlyStopping

# train the model
checkpointer = ModelCheckpoint(filepath = 'model.weights.best.hdf5' , verbose =1 , save_best_only = True )
hist = model . fit(x_train, y_train, batch_size =32 , epochs =100 , validation_data = (x_valid, y_valid), callbacks = [checkpointer], verbose =2 , shuffle = True )

# load the weights that yielded the best validation accuracy
model . load_weights( 'model.weights.best.hdf5' )

# evaluate and print test accuracy
score = model . evaluate(x_test, y_test, verbose =0 )
print ( ' \n ' , 'Test accuracy:' , score[ 1 ])

def train_model(model, num_epochs):
    # train the model
    checkpointer = ModelCheckpoint(filepath = 'model.weights.best.hdf5' , verbose =1 , save_best_only = True )
    hist = model . fit(x_train, y_train, batch_size =32 , epochs =num_epochs , validation_data = (x_valid, y_valid), callbacks = [checkpointer], verbose =2 , shuffle = True )

def load_model(model):
    model.load_weights('model.weights.best.hdf5')
    return model

def score_model(model):
    # evaluate and print test accuracy
    score = model.evaluate(x_test, y_test, verbose =0 )
    print ( ' \n ' , 'Test accuracy:' , score[ 1 ])

def doggieness(result):
    print('\n', 'Doggieness:', result[5]*100.0)
