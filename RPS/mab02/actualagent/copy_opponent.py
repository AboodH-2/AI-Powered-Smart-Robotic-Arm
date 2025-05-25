import random

class CopyOpponentAgent:
    def __init__(self):
        self.name = "CopyOpponentAgent"

    def get_move(self, history):
        if len(history) > 0:
            return history[-1]['opponent']
        else:
            return random.choice(['r', 'p', 's']) 