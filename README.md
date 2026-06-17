# 🏥 Insurance Claim Risk Intelligence Platform
> **A Data-Driven Statistical Study & Machine Learning Model on Medical Charge Drivers**  
> *Developed for Mathematics for Data Science & Analytics (MDSA) Capstone Project | KLH University (Bachupally Campus)*

---

## 👤 Project Metadata
* **Author Name:** Tejaswin Amara  
* **Roll Number:** 2520090104  
* **Academic Major:** CSIT  
* **Completion Date:** June 17, 2026  
* **Interactive Web Dashboard:** [Live GitHub Pages Link](https://tejaswin-amara.github.io/insurance-claim-analysis/)

---

## 🎯 Executive Project Overview
This project provides an end-to-end data-driven investigation into the critical factors driving medical insurance charges in the United States. By leveraging descriptive statistics, statistical inference, and multiple linear regression models with interaction terms, we have built a highly accurate predictive engine to automate underwriting, identify high-risk beneficiary cohorts, and recommend cost-saving wellness interventions.

### Key Performance Results
* **Advanced Model Accuracy ($R^2$):** **88.34%** (explaining 88.3% of premium variance, a **10.1% absolute improvement** over baseline linear models).
* **Root Mean Squared Error (RMSE):** **$4,629.25** (down from $5,992.87 on baseline models).
* **Compounding Smoker-Obesity Effect:** A unit increase in BMI for a smoker adds **+$1,464.73** in annual claims, creating an exponential risk profile.

---

## 📚 Course Outcomes Coverage (CO1 – CO6)

This project comprehensively satisfies all 6 Course Outcomes required for the MDSA Capstone:

| Outcome | Focus Area | Capstone Implementation Details |
| :--- | :--- | :--- |
| **CO1** | **Data Preprocessing** | Ingested `insurance.csv`, detected and removed duplicate records, analyzed outliers using the Interquartile Range (IQR) method, and compiled data for static browser access. |
| **CO2** | **Descriptive Statistics** | Analyzed central tendency (Mean, Median), dispersion (Standard Deviation, Range), and distribution shape (Fisher-Pearson Skewness = `1.51`, Kurtosis) for medical claims. |
| **CO3** | **Probability & Distributions** | Verified conditional risks using Bayes' Theorem. Modeled high-cost risk distributions showing that smokers comprise >95% of claims exceeding $30k. |
| **CO4** | **Statistical Inference** | Conducted Welch's Two-Sample T-Test (unequal variances) comparing smokers vs non-smokers, calculating a T-statistic of `32.74` ($p < 0.0001$) to prove statistical significance. |
| **CO5** | **Correlation & Regression** | Computed a 5x5 Pearson correlation matrix indicating Smoking has the strongest positive correlation with charges ($r = 0.79$), followed by Age ($r = 0.30$). |
| **CO6** | **ML Model Evaluation** | Built and compared a standard Multiple Linear Regression model with an advanced model containing a Smoker-BMI interaction term, performing residual diagnostics. |

---

## 🔬 Mathematical Formulations & ML Models

### 1. Standard Additive Model (Baseline)
$$Charges = \beta_0 + \beta_1(Age) + \beta_2(BMI) + \beta_3(Children) + \beta_4(Smoker_{Yes})$$

* **Intercept ($\beta_0$):** $-\$11,256.75$
* **Coefficients:**
  * **Age ($\beta_1$):** $+\$249.19$ per year
  * **BMI ($\beta_2$):** $+\$305.27$ per unit
  * **Children ($\beta_3$):** $+\$537.97$ per child
  * **Smoker ($\beta_4$):** $+\$23,042.51$
* **Performance Metrics:** $R^2 = 0.8046$ | $\text{RMSE} = \$5,992.87$

---

### 2. Advanced Interaction Model (Recommended)
$$Charges = \beta_0 + \beta_1(Age) + \beta_2(BMI) + \beta_3(Children) + \beta_4(Smoker_{Yes}) + \beta_5(BMI \times Smoker_{Yes})$$

* **Intercept ($\beta_0$):** $-\$2,367.66$
* **Coefficients:**
  * **Age ($\beta_1$):** $+\$260.51$ per year
  * **BMI ($\beta_2$):** $-\$1.13$ per unit (effectively neutral for non-smokers)
  * **Children ($\beta_3$):** $+\$575.51$ per child
  * **Smoker Penalty ($\beta_4$):** $-\$21,412.83$ (offset baseline penalty)
  * **BMI $\times$ Smoker Interaction ($\beta_5$):** $+\$1,464.73$ per unit of BMI
* **Performance Metrics:** $R^2 = 0.8834$ | $\text{RMSE} = \$4,629.25$

> [!NOTE]
> **Why the Interaction Term is Crucial:** The interaction model proves that weight (BMI) is almost completely neutral for non-smokers ($-\$1.13/\text{unit}$), but represents a massive compounding penalty of **$1,464.73/unit$** for tobacco smokers. Obese smokers represent the highest cost driver.

---

## 📂 Repository Directory Structure
```
insurance-claim-analysis/
├── data/
│   └── insurance.csv                 # Cleaned Kaggle dataset (1,337 unique records)
├── docs/                             # Compiled GitHub Pages Dashboard
│   ├── assets/                       # Bundled React static JS & CSS files
│   ├── index.html                    # Entry point for production dashboard hosting
│   └── .nojekyll                     # Directs GitHub Pages to skip Jekyll processing
├── notebooks/                        # Executed Jupyter Notebooks (CO1-CO6)
│   ├── insurance_analysis_v1_baseline.ipynb  # Exploratory stats & basic ML
│   └── insurance_analysis_v2_advanced.ipynb  # Interaction term & diagnostics
├── presentation/
│   └── Insurance_Claim_Analysis__MDSA_Capstone_Project.pptx  # Complete slide presentation
├── reports/
│   └── Executive_Brief.md            # Strategic business briefing document
├── scripts/                          # Python Executables & Helpers
│   ├── train_and_export.py           # Ingestion, training, and static TS exporter
│   ├── predict.py                    # Command Line Prediction Engine
│   ├── insurance_model.pkl           # Trained baseline pickle model
│   └── insurance_model_interaction.pkl # Trained interaction pickle model
└── web-platform/                     # Interactive React Frontend Code
    ├── client/                       # Dashboard UI Source (Vite, React 19, Tailwind v4)
    │   ├── src/
    │   │   ├── components/           # Tab components (Playground, Explorer, Analytics)
    │   │   ├── data/
    │   │   │   └── insuranceData.ts  # Client-side static data and model weights
    │   │   └── lib/
    │   │       └── statistics.ts     # Client-side T-Test and correlation calculators
    │   └── index.html
    └── package.json                  # Frontend script and workspace configurations
```

---

## 🚀 Getting Started

### 1. Interactive Web Dashboard
Simply open [https://tejaswin-amara.github.io/insurance-claim-analysis/](https://tejaswin-amara.github.io/insurance-claim-analysis/) in any browser.
* **Features:**
  * **Prediction Playground:** Sliders to input age, BMI, and dependents. Toggle tobacco status and see standard vs interaction rates compare side-by-side.
  * **Cohort Explorer:** A searchable and filterable database table of all 1,337 beneficiaries calculating cohort mean, median, standard deviation, and skewness instantly.
  * **Statistical Analytics:** Dynamic Welch's T-Test calculations, a live Pearson Correlation Heatmap, and interactive Recharts scatter/distribution plots.

---

### 2. Run Python Predictions on CLI
To run predictions from your console using the trained `.pkl` models:
```bash
# Install required libraries
pip install pandas numpy scikit-learn joblib

# Run prediction
# Usage: python scripts/predict.py <age> <bmi> <children> <smoker_yes/no> [model_type: standard|interaction]
python scripts/predict.py 35 28.5 2 yes interaction
```

---

### 3. Run Notebooks Locally
Open notebooks to inspect formulas, data loading, and homoscedasticity residual diagnostics:
```bash
pip install jupyter notebook pandas numpy matplotlib seaborn scipy scikit-learn
jupyter notebook
```

---

### 4. Build and Run the Dashboard Locally
To modify the dashboard frontend code and compile a production build:
```bash
# Navigate to web-platform
cd web-platform

# Install node dependencies
pnpm install

# Run the dev server
pnpm run dev

# Re-compile the static folder to /docs
pnpm run build:pages
```

---

## 📈 Strategic Business Recommendations

1. **Obesity-Smoker Tiered Underwriting:** Standard pricing models overcharge healthy overweight individuals while undercharging obese smokers. Underwriting policies should implement a tiered pricing structure reflecting the **Smoker $\times$ BMI** interaction.
2. **Targeted Cessation ROI:** Since smoking cessation programs yield a baseline premium reduction of **$21,412.83** plus an additional **$1,464.73** per unit of BMI, weight management incentives should be bundled directly with tobacco cessation programs for maximum financial ROI.
3. **Automated Risk Assessment:** Embed the exported model weights into customer portals to automate preliminary pricing and instant rate underwriting.
