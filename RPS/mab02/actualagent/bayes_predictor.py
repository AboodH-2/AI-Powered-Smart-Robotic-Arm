import random
from sklearn.naive_bayes import MultinomialNB
import numpy as np

class BayesPredictorAgent:
    def __init__(self):
        self.name = "BayesPredictorAgent"
        self.model = MultinomialNB()
        self.X, self.y = [], []

    def get_move(self, history):
        if len(history) < 5:
            return random.choice(['r', 'p', 's'])

        mapping = {'r': 0, 'p': 1, 's': 2}
        self.X, self.y = [], []

        for i in range(2, len(history)):
            prev = [mapping[history[i-2]['player']], mapping[history[i-1]['player']]]
            target = mapping[history[i]['player']]
            self.X.append(prev)
            self.y.append(target)

        self.model.fit(self.X, self.y)
        last_two = [mapping[history[-2]['player']], mapping[history[-1]['player']]]
        prediction = self.model.predict([last_two])[0]

        reverse = {0: 'r', 1: 'p', 2: 's'}
        counter = {'r': 'p', 'p': 's', 's': 'r'}
        return counter[reverse[prediction]]
