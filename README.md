# 🏥 Insurance Claim Analysis: MDSA Capstone Project
**A Comprehensive Statistical Study on Medical Charge Drivers**

---

## 👤 Author Information
- **Name:** Tejaswin Amara
- **Roll Number:** 2520090104
- **Major:** CSIT
- **University:** KLH University (Bachupally Campus)
- **Project:** Mathematics for Data Science and Analytics (MDSA) Capstone

---

## 📋 Project Overview
This project provides a data-driven investigation into the factors that influence medical insurance charges. By applying advanced statistical methodologies and machine learning, we've developed a model that identifies high-risk beneficiaries and predicts annual premiums with high accuracy.

### 🎯 Key Objectives
- **Identify** the primary drivers of insurance claims.
- **Quantify** the interaction between lifestyle factors (Smoking) and physical metrics (BMI).
- **Develop** a predictive framework for premium estimation.

---

## 🔬 Course Outcomes (CO1 – CO6)

| Outcome | Focus Area | Key Implementation |
| :--- | :--- | :--- |
| **CO1** | Data Preprocessing | Outlier detection (IQR), Duplicate removal, Data integrity checks. |
| **CO2** | Descriptive Stats | Central tendency, Dispersion, and Skewness analysis of charges. |
| **CO3** | Probability | Risk modeling using **Bayes' Theorem** and Normal distributions. |
| **CO4** | Statistical Inference | **Two-Sample t-Tests** (Smokers vs. Non-Smokers) with 95% CI. |
| **CO5** | Correlation | Pearson correlation analysis and Simple Linear Regression. |
| **CO6** | ML Evaluation | **Multiple Linear Regression** with interaction terms (BMI * Smoker). |

---

## 📊 Key Findings & Model Performance

### 🚀 Model Metrics
- **R² Score:** `0.7827` (Explains 78.3% of variance)
- **RMSE:** `$5,800.00`
- **MAE:** `$4,186.51`

### 💡 Strategic Insights
- **Smoking Impact:** Smoking is the #1 predictor, adding an average of **+$23,647** to annual charges.
- **Compounding Risk:** The interaction between **BMI ≥ 30** and **Smoking** creates an exponential cost increase, identifying a critical high-risk cluster.
- **Demographics:** Age adds approximately **$257** per year to the baseline premium.

---

## 🛠️ Tech Stack
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Matplotlib](https://img.shields.io/badge/Matplotlib-%23ffffff.svg?style=for-the-badge&logo=Matplotlib&logoColor=black)

---

## 📂 Repository Structure
```bash
├── data/               # Raw and processed datasets
├── notebooks/          # Jupyter Notebooks (v1 & v2 Advanced)
├── reports/            # Executive Brief and Final Presentation
├── scripts/            # Deployment scripts (predict.py)
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### 1. Installation
```bash
pip install pandas numpy matplotlib seaborn scikit-learn joblib
```

### 2. Usage (Prediction Script)
You can use the deployment script to predict charges for a new beneficiary:
```bash
python scripts/predict.py <age> <bmi> <children> <smoker_yes/no>
```
*Example:* `python scripts/predict.py 35 28.5 2 yes`

---

## 📜 License
This project is for academic purposes at **KLH University**. All rights reserved by the author.
