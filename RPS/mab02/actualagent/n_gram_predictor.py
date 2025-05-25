import random
from collections import defaultdict, Counter

class NGramPredictorAgent:
    def __init__(self):
        self.name = "NGramPredictorAgent"
        self.n = 3

    def get_move(self, history):
        if len(history) < self.n:
            return random.choice(['r', 'p', 's'])

        pattern_db = defaultdict(Counter)
        moves = [h['player'] for h in history]
        for i in range(len(moves) - self.n):
            pattern = tuple(moves[i:i + self.n - 1])
            next_move = moves[i + self.n - 1]
            pattern_db[pattern][next_move] += 1

        pattern = tuple(moves[-(self.n - 1):])
        if pattern in pattern_db:
            prediction = pattern_db[pattern].most_common(1)[0][0]
            return {'r': 'p', 'p': 's', 's': 'r'}[prediction]

        return random.choice(['r', 'p', 's'])