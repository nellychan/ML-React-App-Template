# Import libraries
import numpy as np
import pandas as pd
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from sklearn.tree import DecisionTreeClassifier
from sklearn.externals import joblib
from sklearn.model_selection import train_test_split

# Get the dataset
flight_data = pd.read_csv('flight_data.csv',sep=',')

#Subset data
flight_df1=flight_data[['DAY_OF_WEEK','MONTH','BusyFactor','Hourofdeparture_converted','Delay15Min']]

# Split the dataset into features and labels
data_1 = flight_df1.drop('Delay15Min',1) #Feature Matrix
target_1 = flight_df1['Delay15Min'] #Target Variable

# Split the dataset into training (70%) and testing (30%) data
data_1_train, data_1_test, \
target_1_train, target_1_test = train_test_split(data_1, target_1, 
                                                    test_size = 0.3, random_state=999,
                                                    stratify = target_1)
# Build the classifier and make prediction
classifier = DecisionTreeClassifier()
classifier.fit(data_1_train, target_1_train)
prediction = classifier.predict(data_1_test)

# Print the confusion matrix
print("Confusion Matrix:")
print(confusion_matrix(target_1_test, prediction))

# Save the model to disk
joblib.dump(classifier, 'classifier.joblib')
