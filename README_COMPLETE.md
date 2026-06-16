# 🏥 Insurance Claim Analysis: Complete MDSA Capstone Project

**A Comprehensive Statistical Study on Medical Charge Drivers**

---

## 👤 Author Information
- **Name:** Tejaswin Amara
- **Roll Number:** 2520090104
- **Major:** CSIT
- **University:** KLH University (Bachupally Campus)

---

## 🎯 Project Overview

This project provides a data-driven investigation into the factors that influence medical insurance charges. By applying advanced statistical methodologies and machine learning, we've developed a model that identifies high-risk beneficiaries and predicts annual premiums with high accuracy.

**Live Interactive Dashboard:** [https://tejaswin-amara.github.io/insurance-claim-analysis/](https://tejaswin-amara.github.io/insurance-claim-analysis/)

---

## 📊 Key Findings

| Metric | Value |
|--------|-------|
| **Model Accuracy (R²)** | 78.3% |
| **RMSE** | $5,800.00 |
| **Smoking Impact** | +$23,647 annually |
| **Dataset Size** | 1,338 records |

### Strategic Insights
- **Smoking** is the #1 predictor of high medical charges (3.8x higher costs)
- **High BMI (≥30) + Smoking** creates exponential cost increases
- **Age** adds approximately $257 per year to baseline premium

---

## 🔬 Course Outcomes Coverage (CO1–CO6)

| Outcome | Focus Area | Implementation |
|---------|-----------|-----------------|
| **CO1** | Data Preprocessing | Outlier detection (IQR), duplicate removal, data integrity validation |
| **CO2** | Descriptive Statistics | Central tendency, dispersion, skewness analysis of charges |
| **CO3** | Probability & Distributions | Bayes' Theorem verification, risk modeling, statistical distributions |
| **CO4** | Statistical Inference | Hypothesis testing (t-tests), confidence intervals, CLT application |
| **CO5** | Correlation & Regression | Pearson correlation analysis, simple linear regression |
| **CO6** | ML Evaluation | Multiple linear regression, interaction terms, model diagnostics |

---

## 📂 Repository Structure

```
insurance-claim-analysis/
├── docs/                          # GitHub Pages - Interactive Dashboard
│   └── index.html                 # Live prediction engine & analytics
├── notebooks/                     # Jupyter Notebooks
│   ├── insurance_analysis.ipynb   # Main analysis (CO1-CO6)
│   └── insurance_analysis_v2.ipynb # Advanced modeling with interactions
├── scripts/                       # Python Utilities
│   └── predict.py                 # Deployment prediction script
├── reports/                       # Strategic Documents
│   └── Executive_Brief.md         # Business recommendations
├── presentation/                  # PowerPoint
│   └── Insurance_Claim_Analysis__MDSA_Capstone_Project.pptx
├── web-platform/                  # React Web Dashboard Source
│   ├── client/                    # Frontend (React + Tailwind)
│   ├── server/                    # Backend (Express)
│   └── package.json               # Dependencies
└── data/                          # Dataset (if included)
```

---

## 🚀 Getting Started

### 1. View the Interactive Dashboard
Simply visit: [https://tejaswin-amara.github.io/insurance-claim-analysis/](https://tejaswin-amara.github.io/insurance-claim-analysis/)

**Features:**
- **Live Prediction Engine** - Input beneficiary profile and get instant charge predictions
- **Interactive Analytics** - Real-time charts and visualizations
- **Risk Assessment** - Identify high-risk clusters
- **Course Outcome Mapping** - All 6 COs documented

### 2. Run Jupyter Notebooks Locally
```bash
pip install pandas numpy matplotlib seaborn scikit-learn jupyter
jupyter notebook notebooks/insurance_analysis.ipynb
```

### 3. Use the Prediction Script
```bash
python scripts/predict.py <age> <bmi> <children> <smoker_yes/no>
```
*Example:* `python scripts/predict.py 35 28.5 2 yes`

### 4. View the PowerPoint Presentation
Open `presentation/Insurance_Claim_Analysis__MDSA_Capstone_Project.pptx` for the complete slide deck.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19, Tailwind CSS 4, Chart.js |
| **Backend** | Express.js, Node.js |
| **Data Analysis** | Python, Pandas, NumPy, Scikit-learn |
| **Visualization** | Recharts, Matplotlib, Seaborn |
| **Deployment** | GitHub Pages |

---

## 📈 Model Performance

**Multiple Linear Regression Results:**
- **R² Score:** 0.7827 (explains 78.3% of variance)
- **RMSE:** $5,800
- **MAE:** $4,186.51

**Regression Equation:**
```
Charges = -11,947.16 + (256.86 × Age) + (335.56 × BMI) 
          + (425.23 × Children) + (23,647.78 × Smoker)
```

---

## 💡 Key Recommendations

1. **Tiered Risk Pricing** - Implement multi-tiered premiums based on BMI + smoking interaction
2. **Wellness Programs** - Invest in smoking cessation and BMI reduction initiatives
3. **Dynamic Underwriting** - Use the predictive model for automated risk assessment
4. **Early Intervention** - Target high-risk clusters (smokers with BMI ≥30)

---

## 📚 Resources

- **GitHub Repository:** [tejaswin-amara/insurance-claim-analysis](https://github.com/tejaswin-amara/insurance-claim-analysis)
- **Interactive Dashboard:** [GitHub Pages](https://tejaswin-amara.github.io/insurance-claim-analysis/)
- **Dataset:** Kaggle Insurance Dataset (1,338 records)

---

## 📄 License

This project is for academic purposes at **KLH University**. All rights reserved by the author.

---

**Project Completed:** June 16, 2026  
**University:** KLH University (Bachupally Campus)  
**Contact:** [GitHub Profile](https://github.com/tejaswin-amara)
