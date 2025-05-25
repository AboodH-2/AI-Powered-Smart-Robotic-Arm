#!/usr/bin/env python3

import os
import re
from interface.play_typing import AGENT_NAMES

def rename_agents():
    agent_mapping = {}
    
    # List of agent names in order
    agent_names = [
        "always_rock", "always_paper", "always_scissors",
        "frequency_counter", "markov_chain", "pattern_match", "transition_matrix", "decay_weighted_freq",
        "decision_tree", "knn_predictor", "bayes_predictor", "svm_classifier",
        "rnn_predictor", "lstm_sequence", "attention_agent", "transformer_agent",
        "copy_opponent", "statistical", "reactionary", "counter_reactionary", 
        "memory_pattern", "geometry", "testing_pleasure", 
        "stochastic_transition_matrix", "opponent_transition_matrix", "xgboost",
        "de_bruijn", "signature_curve", "recurrence_depth", "clustered_behavior",
        "n_gram_predictor", "gradient_signal", "meta_vote",
        "chaos_responder", "entropy_hunter", "frequency_decay_sigmoid", 
        "decision_stump", "markov_order2"
    ]
    
    for i, agent_name in enumerate(agent_names, 1):
        old_file = f"agents/{agent_name}.py"
        new_file = f"agents/agent{i}.py"
        
        if not os.path.exists(old_file):
            print(f"Warning: {old_file} not found")
            continue
            
        # Read old file
        with open(old_file, 'r') as f:
            content = f.read()
        
        # Extract class name
        class_match = re.search(r'class (\w+):', content)
        if class_match:
            old_class_name = class_match.group(1)
        else:
            old_class_name = "Unknown"
        
        # Replace class name and name attribute
        new_content = re.sub(r'class \w+:', f'class Agent{i}:', content)
        new_content = re.sub(r'self\.name = "[^"]*"', f'self.name = "Agent{i}"', new_content)
        
        # Add original name comment at the top
        lines = new_content.split('\n')
        if lines[0].strip() and not lines[0].startswith('#'):
            lines.insert(0, f'# Originally: {agent_name} ({old_class_name})')
            lines.insert(1, '')
        
        new_content = '\n'.join(lines)
        
        # Write new file
        with open(new_file, 'w') as f:
            f.write(new_content)
            
        print(f"Created agent{i}.py from {agent_name}.py ({old_class_name})")
        agent_mapping[agent_name] = f"agent{i}"
    
    print(f"\nCreated {len(agent_mapping)} agent files")
    print("New AGENT_NAMES list:")
    print([f"agent{i}" for i in range(1, len(agent_names) + 1)])
    
    return agent_mapping

if __name__ == "__main__":
    rename_agents() 