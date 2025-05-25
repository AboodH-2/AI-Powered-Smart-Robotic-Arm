import random

class StatisticalAgent:
    def __init__(self):
        self.name = "StatisticalAgent"
        self.action_histogram = {}

    def get_move(self, history):
        if len(history) == 0:
            self.action_histogram = {}
            return random.choice(['r', 'p', 's'])
        
        # Update histogram with opponent's last action
        last_opp_action = history[-1]['opponent']
        if last_opp_action not in self.action_histogram:
            self.action_histogram[last_opp_action] = 0
        self.action_histogram[last_opp_action] += 1
        
        # Find the most common opponent action
        mode_action = None
        mode_action_count = 0
        for action, count in self.action_histogram.items():
            if count > mode_action_count:
                mode_action = action
                mode_action_count = count
        
        # Counter the most common action
        if mode_action:
            counter_map = {'r': 'p', 'p': 's', 's': 'r'}
            return counter_map[mode_action]
        
        return random.choice(['r', 'p', 's'])
