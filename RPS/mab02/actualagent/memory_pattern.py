import random
from collections import defaultdict

class MemoryPatternAgent:
    def __init__(self):
        self.name = "MemoryPatternAgent"
        self.memory_depth = 5

    def get_move(self, history):
        if len(history) < self.memory_depth:
            return random.choice(['r', 'p', 's'])

        opponent_moves = [entry['opponent'] for entry in history]
        pattern_memory = defaultdict(list)

        # Update pattern memory from entire history
        for i in range(len(opponent_moves) - self.memory_depth + 1):
            sub_pattern = tuple(opponent_moves[i:i + self.memory_depth - 1])
            next_move = opponent_moves[i + self.memory_depth - 1]
            pattern_memory[sub_pattern].append(next_move)

        current_pattern = tuple(opponent_moves[-(self.memory_depth - 1):])
        if current_pattern in pattern_memory:
            next_moves = pattern_memory[current_pattern]
            prediction = max(set(next_moves), key=next_moves.count)
            counter = {'r': 'p', 'p': 's', 's': 'r'}
            return counter[prediction]

        return random.choice(['r', 'p', 's'])
