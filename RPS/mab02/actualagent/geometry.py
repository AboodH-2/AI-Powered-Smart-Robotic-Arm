import random
import math

class GeometryAgent:
    def __init__(self):
        self.name = "GeometryAgent"
        self.step_count = 0
        self.move_map = {'r': 0, 'p': 1, 's': 2}
        self.reverse_map = {0: 'r', 1: 'p', 2: 's'}

    def get_move(self, history):
        self.step_count += 1
        
        if len(history) < 3:
            return random.choice(['r', 'p', 's'])
        
        # Use geometric patterns to predict
        opponent_moves = [self.move_map[entry['opponent']] for entry in history]
        
        # Calculate moving average with geometric weighting
        weights = [math.exp(-i/5) for i in range(len(opponent_moves))]
        weighted_sum = sum(move * weight for move, weight in zip(opponent_moves, weights))
        total_weight = sum(weights)
        
        if total_weight > 0:
            predicted_avg = weighted_sum / total_weight
            
            # Add periodic component based on step count
            phase = (self.step_count * 2 * math.pi) / 7  # Period of 7
            periodic_component = math.sin(phase) * 0.5
            
            prediction = (predicted_avg + periodic_component) % 3
            predicted_move = int(round(prediction)) % 3
            
            # Counter the prediction
            counter_move = (predicted_move + 1) % 3
            return self.reverse_map[counter_move]
        
        return random.choice(['r', 'p', 's']) 