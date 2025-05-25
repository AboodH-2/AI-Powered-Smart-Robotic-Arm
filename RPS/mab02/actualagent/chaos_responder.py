import random
class ChaosResponderAgent:
    def __init__(self):
        self.name = "ChaosResponderAgent"

    def get_move(self, history):
        if len(history) < 6:
            return random.choice(['r', 'p', 's'])

        pattern = [entry['opponent'] for entry in history[-5:]]
        predictable = len(set(pattern)) < 3
        if predictable:
            return {'r': 'p', 'p': 's', 's': 'r'}[pattern[-1]]
        else:
            return random.choice(['r', 'p', 's'])
