import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CheckCircle2, Award, ChevronRight } from "lucide-react";

export default function AcademicMapping() {
  const outcomes = [
    {
      id: "CO1",
      title: "Data Preprocessing & Quality Verification",
      focus: "Cleaning, duplicate removal, outlier analysis, and dataset structure validation.",
      implementation: "During the modeling pipeline (scripts/train_and_export.py), duplicate records (such as duplicate beneficiary profiles) are detected and removed. Outliers are investigated using the Interquartile Range (IQR) method: charges above Q3 + 1.5 * IQR represent high-cost outliers rather than errors, demonstrating that medical claims follow a heavy-tailed distribution."
    },
    {
      id: "CO2",
      title: "Descriptive Statistics",
      focus: "Central tendency (mean, median), dispersion (variance, standard deviation), skewness, and kurtosis.",
      implementation: "Computed live in the Cohort Explorer. For any chosen subset of beneficiaries (e.g. non-smokers in the southwest), the dashboard calculates the sample mean, median, standard deviation, and Fisher-Pearson skewness. The positive skewness value (~1.5) proves the asymmetrical nature of medical claims."
    },
    {
      id: "CO3",
      title: "Probability & Risk Distributions",
      focus: "Applying Bayes' Theorem and examining likelihood of high-cost events.",
      implementation: "We apply Bayes' Theorem: P(Smoker | High Claim) = [P(High Claim | Smoker) * P(Smoker)] / P(High Claim). The high-cost risk distribution shows that while smokers represent only ~20% of the total dataset, they comprise over 95% of the highest risk tier (claims > $30k)."
    },
    {
      id: "CO4",
      title: "Statistical Inference & Hypothesis Testing",
      focus: "Applying Central Limit Theorem, confidence intervals, and hypothesis testing.",
      implementation: "Implemented live on the Analytics tab using a Welch's Two-Sample T-Test (unequal variances). It tests the hypothesis that tobacco smokers incur significantly different charges than non-smokers. It dynamically computes the T-statistic, degrees of freedom, and two-tailed P-value, confirming statistical significance (p < 0.05) across all custom beneficiary groups."
    },
    {
      id: "CO5",
      title: "Correlation & Simple Linear Regression",
      focus: "Pearson correlation coefficient, heatmaps, and simple regression equations.",
      implementation: "Calculated dynamically in the Analytics tab. The dashboard constructs a 5x5 Pearson correlation matrix for the active cohort. A hoverable heatmap visualizes the relationships, demonstrating that Smoking status has the strongest positive correlation with Charges (r ~ 0.79), followed by Age (r ~ 0.30)."
    },
    {
      id: "CO6",
      title: "Machine Learning & Model Evaluation",
      focus: "Multiple linear regression, interaction terms, diagnostics, and metrics (R², RMSE, MAE).",
      implementation: "We implement and compare two models. The Standard Model (R² = 0.8046) uses independent variables linearly. The Advanced Model (R² = 0.8834) introduces a Smoker-BMI interaction term: charges ~ age + bmi + children + smoker + (bmi * smoker). This interaction corrects model fit for obese smokers, reducing RMSE by ~23% and predicting charges with superior accuracy."
    }
  ];

  return (
    <Card className="bg-slate-900/40 border-slate-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Course Outcomes (CO1 - CO6) Coverage
        </CardTitle>
        <p className="text-xs text-slate-400">
          How this MDSA Capstone Project satisfies university learning requirements.
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {outcomes.map((co) => (
            <AccordionItem
              key={co.id}
              value={co.id}
              className="border border-slate-800 bg-slate-900/20 px-4 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="bg-blue-500/10 text-blue-400 font-bold px-2 py-1 rounded text-xs shrink-0">
                    {co.id}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{co.title}</h4>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">{co.focus}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2 border-t border-slate-850 text-xs text-slate-400 leading-relaxed space-y-2">
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>{co.implementation}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
