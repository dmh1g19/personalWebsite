---
title: Modeling an ml model for detecting bots in a social network
description: Using logictic regression and RF
recommended: true
---

This model is based on the following paper:
**https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=9358734**

# Load the data
```python
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectFromModel
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC

data = pd.read_csv("datasets/twitter_human_bots_dataset.csv")
```


# Drop unnecessary columns
```python
columns_to_drop = ["created_at", "description", "id", "default_profile_image", "profile_image_url", "screen_name", "profile_background_image_url"]
data = data.drop(columns=columns_to_drop)
```


# Label encoding for 'account_type'
```python
label_encoder = LabelEncoder()
data['account_type'] = label_encoder.fit_transform(data['account_type'])
```

# WoE encoding for 'lang' and 'location'
```python
def calculate_woe(data, column, target_column):
    woe_dict = {}
    total_events = data[target_column].sum()
    total_nonevents = data.shape[0] - total_events
    
    for category in data[column].unique():
        events = data[(data[column] == category) & (data[target_column] == 1)].shape[0]
        nonevents = data[(data[column] == category) & (data[target_column] == 0)].shape[0]
        
        if events == 0:
            woe_value = -10  # Clip to a reasonable lower value
        elif nonevents == 0:
            woe_value = 10   # Clip to a reasonable upper value
        else:
            woe_value = np.log((nonevents / total_nonevents) / (events / total_events))
            # Clip the WoE value to a reasonable range
            woe_value = max(-10, min(10, woe_value))
        
        woe_dict[category] = woe_value
    
    return woe_dict

woe_lang = calculate_woe(data, 'lang', 'account_type')
woe_location = calculate_woe(data, 'location', 'account_type')

data['lang'] = data['lang'].map(woe_lang)
data['location'] = data['location'].map(woe_location)
```

# Feature scaling
```python
scaler = StandardScaler()
data[['friends_count', 'favourites_count']] = scaler.fit_transform(data[['friends_count', 'favourites_count']])
```

# Split the data into training and testing
```python
X = data.drop(columns=['account_type'])
y = data['account_type']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

# Feature selection using a Random Forest model
```python
rf_model = RandomForestClassifier()
rf_model.fit(X_train, y_train)
model_feature_selector = SelectFromModel(rf_model, prefit=True)

X_train_selected = model_feature_selector.transform(X_train)
X_test_selected = model_feature_selector.transform(X_test)
```

# Train a logistic regression model, predict and evaluate
```python
logistic_regression = LogisticRegression()
logistic_regression.fit(X_train_selected, y_train)

y_pred = logistic_regression.predict(X_test_selected)

accuracy_lr = accuracy_score(y_test, y_pred)

print(f'Accuracy: {accuracy_lr}')
```

    Accuracy: 0.671073717948718



# Train a Random Forest classifier, predict and evaluate
```python
rf_classifier = RandomForestClassifier()
rf_classifier.fit(X_train_selected, y_train)

y_pred = rf_classifier.predict(X_test_selected)

accuracy_rf = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy_rf}')
```

    Accuracy: 0.8880876068376068


# Print results
```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def display_scores(model_name, y_true, y_pred, y_prob):
    accuracy = accuracy_score(y_true, y_pred)
    precision = precision_score(y_true, y_pred)
    recall = recall_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    auc = roc_auc_score(y_true, y_prob)
    
    print(f"Model: {model_name}")
    print(f"Accuracy: {accuracy}")
    print(f"Precision: {precision}")
    print(f"Recall: {recall}")
    print(f"F1 Score: {f1}")
    print(f"AUC: {auc}")
    print("")

y_pred_lr = logistic_regression.predict(X_test_selected)
y_prob_lr = logistic_regression.predict_proba(X_test_selected)[:, 1]

y_pred_rf = rf_classifier.predict(X_test_selected)
y_prob_rf = rf_classifier.predict_proba(X_test_selected)[:, 1]

display_scores("Logistic Regression", y_test, y_pred_lr, y_prob_lr)
display_scores("Random Forest", y_test, y_pred_rf, y_prob_rf)

```

    Model: Logistic Regression
    Accuracy: 0.671073717948718
    Precision: 0.6700616456714018
    Recall: 0.9998000399920016
    F1 Score: 0.8023750300890637
    AUC: 0.8060603400027674
    
    Model: Random Forest
    Accuracy: 0.8880876068376068
    Precision: 0.9022222222222223
    Recall: 0.9336132773445311
    F1 Score: 0.9176493710691824
    AUC: 0.9458598831098275