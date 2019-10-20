import cv2
import numpy as np
import tensorflow as tf
CATEGORIES = ["garbage","not_garbage"]

IMG_SIZE = 100
def prepare(file):
    IMG_SIZE = 100
    img_array = cv2.imread(file, cv2.IMREAD_GRAYSCALE)
    new_array = cv2.resize(img_array, (IMG_SIZE, IMG_SIZE))
    return new_array.reshape(-1, IMG_SIZE, IMG_SIZE, 1)
model = tf.keras.models.load_model("CNN.model")
image = "test.jpg" #your image path
image = cv2.imread(image,cv2.IMREAD_GRAYSCALE)
image = cv2.resize(image, (100,100))
a = [image]
a = np.array(a).reshape(-1, IMG_SIZE, IMG_SIZE, 1)
prediction = model.predict(a)
print(prediction)
prediction = prediction[0]

