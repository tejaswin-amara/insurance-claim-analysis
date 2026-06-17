# Executive Brief: Insurance Claim Risk Analysis
**Strategic Insights & Predictive Underwriting Models for Business Stakeholders**

---

## 1. Executive Summary
This analysis details the critical statistical drivers of medical insurance costs within the US beneficiary population. By leveraging advanced statistical modeling and machine learning on 1,337 unique beneficiary profiles, we have built a **multiple linear regression model with interaction terms** that achieves **88.34% predictive accuracy ($R^2 = 0.8834$)** in estimating annual premium charges, reducing baseline model prediction error (RMSE) by **22.7%**.

---

## 2. Key Statistical Insights

### 💸 The Compounding Smoker-BMI Effect (Interaction)
Our models reveal that weight (BMI) and tobacco smoking do not act as independent, additive costs. Instead, they compound exponentially:
* **For Non-Smokers:** BMI has a virtually flat effect on medical charges ($-\$1.13$ per unit of BMI). Being overweight or obese does not drastically increase annual claim costs in the absence of tobacco.
* **For Smokers:** Each unit increase in BMI adds a staggering **$1,464.73** to annual claims. For a smoker with a BMI of 30 (clinical obesity), this interaction adds **$43,941.90** in compounding risk charges, showing why wellness interventions must target these high-risk clusters.

### 🎂 Demographic and Family Drivers
* **Age:** Adds approximately **$260.51 per year** of life, reflecting a steady baseline increase in medical risk.
* **Children/Dependents:** Each dependent increases the baseline annual charge by **$575.51**, reflecting family plan coverage drivers.

---

## 3. Comparative Model Performance

Our analysis evaluated two models for risk underwriting:

| Underwriting Model | R² Score | RMSE (Error) | Key Business Character |
| :--- | :---: | :---: | :--- |
| **Standard Model (Baseline)** | 80.46% | $5,992.87 | Overcharges healthy obese non-smokers; undercharges obese smokers. |
| **Interaction Model (Recommended)** | **88.34%** | **$4,629.25** | Corrects baseline biases; captures exponential smoker-BMI risk. |

$$\text{Interaction Formula: } Charges = -2367.66 + 260.51(Age) - 1.13(BMI) + 575.51(Children) - 21412.83(Smoker) + 1464.73(BMI \times Smoker)$$

---

## 4. Strategic Recommendations

1. **Compounding Smoker-Obesity Premium Surcharges:** Standard pricing structures undercharge high-risk obese smokers. Underwriting guidelines should implement a premium structure that multiplies BMI by smoking status (reflecting the $+\$1,464.73/\text{unit}$ interaction) rather than simple flat surcharges.
2. **High-ROI Wellness Incentives:** Bundling smoking cessation plans with weight reduction incentives represents the highest financial ROI for claim reductions. A smoker with a BMI of 32 who successfully quits smoking yields an estimated annual claim cost reduction of over **$25,000**.
3. **Dynamic Portal Underwriting:** Automate rate quoting on customer websites by embedding the interaction model's coefficients, enabling instant, transparent risk tiering.

---
**Lead Analyst:** Tejaswin Amara  
**Date:** June 17, 2026  
**University:** KLH University (Bachupally Campus)  
**Interactive Dashboard:** [https://tejaswin-amara.github.io/insurance-claim-analysis/](https://tejaswin-amara.github.io/insurance-claim-analysis/)
