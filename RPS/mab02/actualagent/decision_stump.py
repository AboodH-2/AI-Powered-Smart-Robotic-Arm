import random

class DecisionStumpAgent:
    def __init__(self):
        self.name = "DecisionStumpAgent"

    def get_move(self, history):
        if not history:
            return random.choice(['r', 'p', 's'])
        last = history[-1]['player']
        return self._counter(last)

    def _counter(self, move):
        return {'r': 'p', 'p': 's', 's': 'r'}[move]