import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib

def main():
    # Paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_dir = os.path.dirname(script_dir)
    csv_path = os.path.join(repo_dir, 'data', 'insurance.csv')
    ts_output_path = os.path.join(repo_dir, 'web-platform', 'client', 'src', 'data', 'insuranceData.ts')
    
    print(f"Loading data from {csv_path}...")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found at {csv_path}")
        
    df = pd.read_csv(csv_path)
    
    # Preprocessing
    initial_len = len(df)
    df = df.drop_duplicates()
    print(f"Removed {initial_len - len(df)} duplicate records. Total records: {len(df)}")
    
    # Map smoker for model usage
    df['smoker_numeric'] = df['smoker'].map({'yes': 1, 'no': 0})
    df['bmi_smoker_interaction'] = df['bmi'] * df['smoker_numeric']
    
    # ----------------------------------------------------
    # Model 1: Standard Multiple Linear Regression
    # Features: age, bmi, children, smoker_yes
    # ----------------------------------------------------
    X_std = df[['age', 'bmi', 'children', 'smoker_numeric']].copy()
    X_std.rename(columns={'smoker_numeric': 'smoker_yes'}, inplace=True)
    y = df['charges']
    
    X_train_std, X_test_std, y_train, y_test = train_test_split(
        X_std, y, test_size=0.2, random_state=42
    )
    
    model_std = LinearRegression().fit(X_train_std, y_train)
    y_pred_std = model_std.predict(X_test_std)
    
    r2_std = r2_score(y_test, y_pred_std)
    rmse_std = np.sqrt(mean_squared_error(y_test, y_pred_std))
    mae_std = mean_absolute_error(y_test, y_pred_std)
    
    print("\n--- Standard Model ---")
    print(f"Intercept: {model_std.intercept_:.4f}")
    print(f"Coefficients: {dict(zip(X_std.columns, model_std.coef_))}")
    print(f"R2: {r2_std:.4f}, RMSE: {rmse_std:.4f}, MAE: {mae_std:.4f}")
    
    # ----------------------------------------------------
    # Model 2: Advanced Multiple Linear Regression with Interaction
    # Features: age, bmi, children, smoker_yes, bmi_smoker_interaction
    # ----------------------------------------------------
    X_int = df[['age', 'bmi', 'children', 'smoker_numeric', 'bmi_smoker_interaction']].copy()
    X_int.rename(columns={'smoker_numeric': 'smoker_yes'}, inplace=True)
    
    X_train_int, X_test_int, _, _ = train_test_split(
        X_int, y, test_size=0.2, random_state=42
    )
    
    model_int = LinearRegression().fit(X_train_int, y_train)
    y_pred_int = model_int.predict(X_test_int)
    
    r2_int = r2_score(y_test, y_pred_int)
    rmse_int = np.sqrt(mean_squared_error(y_test, y_pred_int))
    mae_int = mean_absolute_error(y_test, y_pred_int)
    
    print("\n--- Interaction Model ---")
    print(f"Intercept: {model_int.intercept_:.4f}")
    print(f"Coefficients: {dict(zip(X_int.columns, model_int.coef_))}")
    print(f"R2: {r2_int:.4f}, RMSE: {rmse_int:.4f}, MAE: {mae_int:.4f}")
    
    # Save pkl models
    joblib.dump(model_std, os.path.join(script_dir, 'insurance_model.pkl'))
    joblib.dump(model_int, os.path.join(script_dir, 'insurance_model_interaction.pkl'))
    print(f"\nSaved .pkl models to {script_dir}")
    
    # Generate TypeScript file
    records = df[['age', 'sex', 'bmi', 'children', 'smoker', 'region', 'charges']].to_dict(orient='records')
    
    ts_content = f"""// Generated automatically by scripts/train_and_export.py. Do not edit manually.

export interface InsuranceRecord {{
  age: number;
  sex: 'male' | 'female';
  bmi: number;
  children: number;
  smoker: 'yes' | 'no';
  region: 'northeast' | 'northwest' | 'southeast' | 'southwest';
  charges: number;
}}

export const modelCoefficients = {{
  standard: {{
    intercept: {model_std.intercept_},
    age: {model_std.coef_[0]},
    bmi: {model_std.coef_[1]},
    children: {model_std.coef_[2]},
    smoker_yes: {model_std.coef_[3]},
    r2: {r2_std},
    rmse: {rmse_std},
    mae: {mae_std}
  }},
  interaction: {{
    intercept: {model_int.intercept_},
    age: {model_int.coef_[0]},
    bmi: {model_int.coef_[1]},
    children: {model_int.coef_[2]},
    smoker_yes: {model_int.coef_[3]},
    bmi_smoker_interaction: {model_int.coef_[4]},
    r2: {r2_int},
    rmse: {rmse_int},
    mae: {mae_int}
  }}
}};

export const insuranceData: InsuranceRecord[] = {json.dumps(records, indent=2)};
"""
    
    # Create target directories if they don't exist
    os.makedirs(os.path.dirname(ts_output_path), exist_ok=True)
    with open(ts_output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
        
    print(f"Generated TypeScript data file: {ts_output_path}")

if __name__ == '__main__':
    main()
