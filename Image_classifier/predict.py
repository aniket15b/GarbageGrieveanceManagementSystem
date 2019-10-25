import cv2, os
import numpy as np
import tensorflow as tf
CATEGORIES = ["garbage","not_garbage"]

IMG_SIZE = 100
def prepare(file):
    IMG_SIZE = 100
    img_array = cv2.imread(file, cv2.IMREAD_GRAYSCALE)
    new_array = cv2.resize(img_array, (IMG_SIZE, IMG_SIZE))
    return new_array.reshape(-1, IMG_SIZE, IMG_SIZE, 1)
model = tf.keras.models.load_model("/home/aniket/GarbageGrieveanceManagementSystem/Image_classifier/CNN.model")
image = "/home/aniket/GarbageGrieveanceManagementSystem/Images/"+os.listdir("/home/aniket/GarbageGrieveanceManagementSystem/Images")[0]
a = prepare(image)
prediction = model.predict(a)
prediction = prediction[0]
print(prediction[0])

