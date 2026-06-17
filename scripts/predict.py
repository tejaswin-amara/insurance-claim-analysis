import os
import sys
import joblib
import pandas as pd

def predict_charge(age, bmi, children, smoker, model_type='interaction'):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    if model_type == 'interaction':
        model_path = os.path.join(script_dir, 'insurance_model_interaction.pkl')
    else:
        model_path = os.path.join(script_dir, 'insurance_model.pkl')
        
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}. Run training first.")
        sys.exit(1)
        
    model = joblib.load(model_path)
    
    smoker_val = 1 if smoker.lower() in ['yes', 'y', '1', 'true'] else 0
    
    if model_type == 'interaction':
        interaction = bmi * smoker_val
        data = {
            'age': [age],
            'bmi': [bmi],
            'children': [children],
            'smoker_yes': [smoker_val],
            'bmi_smoker_interaction': [interaction]
        }
    else:
        data = {
            'age': [age],
            'bmi': [bmi],
            'children': [children],
            'smoker_yes': [smoker_val]
        }
        
    df_input = pd.DataFrame(data)
    
    # Reorder columns to match model training feature names order
    df_input = df_input[model.feature_names_in_]
    
    prediction = model.predict(df_input)[0]
    return max(0, prediction)

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python predict.py <age> <bmi> <children> <smoker_yes/no> [model_type: standard|interaction]")
        print("Example: python predict.py 35 28.5 2 yes interaction")
    else:
        age = float(sys.argv[1])
        bmi = float(sys.argv[2])
        children = int(sys.argv[3])
        smoker = sys.argv[4]
        
        model_type = 'interaction'
        if len(sys.argv) >= 6:
            model_type = sys.argv[5].lower()
            if model_type not in ['standard', 'interaction']:
                print("Warning: Unknown model type. Using 'interaction' as default.")
                model_type = 'interaction'
                
        res = predict_charge(age, bmi, children, smoker, model_type)
        print(f"Model: {model_type.capitalize()}")
        print(f"Predicted Insurance Charge: ${res:,.2f}")
