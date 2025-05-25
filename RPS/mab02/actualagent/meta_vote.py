import random
from collections import defaultdict, Counter
import math
class MetaVoteAgent:
    def __init__(self):
        self.name = "MetaVoteAgent"
        self.sub_agents = [MarkovOrder2Agent(), DecisionStumpAgent(), (), Transition_matrix(), xgboost(), transformer_agent()] 

    def get_move(self, history):
        votes = [agent.get_move(history) for agent in self.sub_agents]
        vote_counts = Counter(votes)
        majority_vote = vote_counts.most_common(1)[0][0]
        return majority_vote