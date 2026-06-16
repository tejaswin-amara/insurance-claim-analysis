# Insurance Claim Analysis: MDSA Capstone Project

## Project Overview
This repository contains the complete analytical workflow for the **Insurance Claim Analysis** project, completed as part of the Mathematics for Data Science and Analytics (MDSA) Capstone at **KLH University**.

The project investigates the primary drivers of medical insurance charges using the Kaggle Insurance Dataset (1,338 records).

## Author
- **Tejaswin Amara**
- CSIT Major | Roll Number: 2520090104
- KLH University (Bachupally Campus)

## Course Outcomes (CO1–CO6)
- **CO1: Data Preprocessing** - Handling duplicates, missing values, and IQR-based outlier detection.
- **CO2: Descriptive Statistics** - Analyzing central tendency, dispersion, and skewness of charges.
- **CO3: Probability & Distributions** - Risk modeling using Bayes' Theorem and statistical distributions.
- **CO4: Statistical Inference** - Hypothesis testing (Two-sample t-test) between risk groups.
- **CO5: Correlation & Regression** - Quantifying relationships between age, BMI, and charges.
- **CO6: Evaluation & Visualization** - Building a Multiple Linear Regression model with an R² of 0.7827.

## Key Findings
- **Smoking** is the most significant predictor of high medical charges.
- The model explains **78.3%** of the variance in insurance premiums.
- High BMI combined with smoking creates a compounding "High-Risk" cluster.

## Repository Structure
- `insurance_analysis.ipynb`: Complete Python implementation in a Jupyter Notebook.
- `insurance.csv`: Dataset used for the analysis.
- `README.md`: Project documentation.

## How to Run
1. Ensure you have Python installed with `pandas`, `numpy`, `matplotlib`, `seaborn`, `scipy`, and `scikit-learn`.
2. Open `insurance_analysis.ipynb` in Jupyter Notebook or VS Code.
3. Run all cells to reproduce the statistical findings and visualizations.
