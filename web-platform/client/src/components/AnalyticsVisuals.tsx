import { useMemo, useState, Fragment } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar, Line } from "recharts";
import { insuranceData, InsuranceRecord, modelCoefficients } from "@/data/insuranceData";
import { computeWelchTTest, computePearsonCorrelation, computeSummaryStats } from "@/lib/statistics";
import { TrendingUp, Percent, Award, AlertTriangle, FileText, ClipboardCopy, Check, X, RefreshCw } from "lucide-react";

interface AnalyticsVisualsProps {
  filteredData: InsuranceRecord[];
}

export default function AnalyticsVisuals({ filteredData }: AnalyticsVisualsProps) {
  const [selectedDiagModel, setSelectedDiagModel] = useState<"standard" | "interaction">("interaction");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Welch's T-Test comparing Smokers vs Non-Smokers in this filtered cohort
  const tTestResult = useMemo(() => {
    const smokers = filteredData.filter((d) => d.smoker === "yes").map((d) => d.charges);
    const nonSmokers = filteredData.filter((d) => d.smoker === "no").map((d) => d.charges);
    return computeWelchTTest(smokers, nonSmokers);
  }, [filteredData]);

  // Correlation Matrix Variables
  const correlationVariables = [
    { label: "Age", key: "age" as keyof InsuranceRecord },
    { label: "BMI", key: "bmi" as keyof InsuranceRecord },
    { label: "Children", key: "children" as keyof InsuranceRecord },
    { label: "Smoker", key: "smoker" as keyof InsuranceRecord },
    { label: "Charges", key: "charges" as keyof InsuranceRecord },
  ];

  // Compute Correlation Matrix
  const correlationMatrix = useMemo(() => {
    const n = filteredData.length;
    const matrix: number[][] = [];
    if (n < 2) return matrix;

    const getValueArray = (key: keyof InsuranceRecord): number[] => {
      return filteredData.map((d) => {
        const val = d[key];
        if (key === "smoker") return val === "yes" ? 1 : 0;
        if (key === "sex") return val === "male" ? 1 : 0;
        return val as number;
      });
    };

    const arrays = correlationVariables.map((v) => getValueArray(v.key));

    for (let i = 0; i < correlationVariables.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < correlationVariables.length; j++) {
        matrix[i][j] = computePearsonCorrelation(arrays[i], arrays[j]);
      }
    }
    return matrix;
  }, [filteredData]);

  // Recharts: Sample Scatter Data (limit to 200 items for SVG rendering performance)
  const scatterData = useMemo(() => {
    if (filteredData.length <= 200) return filteredData;
    const step = Math.floor(filteredData.length / 200);
    return filteredData.filter((_, idx) => idx % step === 0).slice(0, 200);
  }, [filteredData]);

  // Recharts: Smoker Charges Comparison
  const smokerImpactData = useMemo(() => {
    const smokers = filteredData.filter((d) => d.smoker === "yes").map((d) => d.charges);
    const nonSmokers = filteredData.filter((d) => d.smoker === "no").map((d) => d.charges);

    const avgSmoker = smokers.length > 0 ? smokers.reduce((a, b) => a + b, 0) / smokers.length : 0;
    const avgNonSmoker = nonSmokers.length > 0 ? nonSmokers.reduce((a, b) => a + b, 0) / nonSmokers.length : 0;

    return [
      { category: "Non-Smoker", avgCharge: Math.round(avgNonSmoker) },
      { category: "Smoker", avgCharge: Math.round(avgSmoker) },
    ];
  }, [filteredData]);

  // Recharts: Risk Category distribution
  const riskDistribution = useMemo(() => {
    let low = 0, med = 0, high = 0;
    filteredData.forEach((d) => {
      if (d.charges < 15000) low++;
      else if (d.charges < 30000) med++;
      else high++;
    });
    return [
      { name: "Low Risk (<$15k)", value: low, fill: "#10b981" },
      { name: "Medium Risk ($15k-$30k)", value: med, fill: "#f59e0b" },
      { name: "High Risk (>$30k)", value: high, fill: "#ef4444" },
    ];
  }, [filteredData]);

  // Helper to color heatmap cells
  const getHeatmapColor = (val: number) => {
    const opacity = Math.abs(val);
    if (val >= 0) return `rgba(239, 68, 68, ${opacity})`; // Red for positive
    return `rgba(59, 130, 246, ${opacity})`; // Blue for negative
  };

  // Compute Predictions and Residuals for diagnostics
  const diagnosticData = useMemo(() => {
    return filteredData.map((d) => {
      const smokerVal = d.smoker === "yes" ? 1 : 0;
      let predicted = 0;
      const coef = modelCoefficients[selectedDiagModel];
      
      if (selectedDiagModel === "standard") {
        predicted = coef.intercept +
                    coef.age * d.age +
                    coef.bmi * d.bmi +
                    coef.children * d.children +
                    coef.smoker_yes * smokerVal;
      } else {
        predicted = coef.intercept +
                    coef.age * d.age +
                    coef.bmi * d.bmi +
                    coef.children * d.children +
                    coef.smoker_yes * smokerVal +
                    coef.bmi_smoker_interaction * d.bmi * smokerVal;
      }
      
      return {
        ...d,
        predicted: Math.round(predicted),
        residual: Math.round(d.charges - predicted)
      };
    });
  }, [filteredData, selectedDiagModel]);

  // Sample diagnostic data for scatter plots (max 200)
  const diagPlotData = useMemo(() => {
    if (diagnosticData.length <= 200) return diagnosticData;
    const step = Math.floor(diagnosticData.length / 200);
    return diagnosticData.filter((_, idx) => idx % step === 0).slice(0, 200);
  }, [diagnosticData]);

  // Diagonal line data for perfect fit y = x in Actual vs Predicted
  const diagonalLineData = useMemo(() => {
    return [
      { predicted: 0, charges: 0 },
      { predicted: 65000, charges: 65000 }
    ];
  }, []);

  // Generate Report Markdown
  const reportMarkdown = useMemo(() => {
    const stats = computeSummaryStats(filteredData.map(d => d.charges));
    const smokerCount = filteredData.filter(d => d.smoker === 'yes').length;
    const smokerRatio = filteredData.length > 0 ? (smokerCount / filteredData.length) * 100 : 0;
    
    let tTestText = "N/A (Insufficient samples)";
    if (filteredData.length >= 4) {
      const sig = tTestResult.pValue < 0.05 ? "REJECT H₀" : "FAIL TO REJECT H₀";
      tTestText = `T-Statistic: ${tTestResult.tStat.toFixed(4)}
Degrees of Freedom: ${tTestResult.df.toFixed(2)}
P-Value: ${tTestResult.pValue < 0.0001 ? "< 0.0001" : tTestResult.pValue.toFixed(6)}
Decision: ${sig} (Smoker and non-smoker claims have ${tTestResult.pValue < 0.05 ? "statistically significant differences" : "no statistically significant differences"} at 95% confidence level)`;
    }

    const standardFormula = "Charges = -11,256.75 + 249.19*Age + 305.27*BMI + 537.97*Children + 23,042.51*Smoker_Yes";
    const interactionFormula = "Charges = -2,367.66 + 260.51*Age - 1.13*BMI + 575.51*Children - 21,412.83*Smoker_Yes + 1,464.73*(BMI*Smoker_Yes)";

    return `# 🏥 Insurance Claim Risk Intelligence Underwriting Report
Generated: ${new Date().toLocaleDateString()}
Analysis Scope: Custom Filtered Cohort

## 1. Cohort Demographics & Summary Statistics
- **Total Sample Size (N):** ${filteredData.length} records
- **Average Claim Cost:** $${Math.round(stats.mean).toLocaleString()}
- **Median Claim Cost:** $${Math.round(stats.median).toLocaleString()}
- **Standard Deviation:** $${Math.round(stats.stdDev).toLocaleString()}
- **Minimum Claim:** $${Math.round(stats.min).toLocaleString()}
- **Maximum Claim:** $${Math.round(stats.max).toLocaleString()}
- **Tobacco Smoker Percentage:** ${smokerRatio.toFixed(1)}% (${smokerCount} out of ${filteredData.length} individuals)
- **Fisher-Pearson Skewness:** ${stats.skewness.toFixed(3)}

## 2. Statistical Inference & Hypothesis Testing (CO4)
Evaluating whether smoking status has a statistically significant impact on charges:
\`\`\`text
${tTestText}
\`\`\`

## 3. Multiple Regression Predictive Performance (CO6)
We evaluate risk using two trained Ordinary Least Squares (OLS) models:

### Model 1: Standard Additive Model (Baseline)
- **R² Score:** ${(modelCoefficients.standard.r2 * 100).toFixed(2)}% (explains ${ (modelCoefficients.standard.r2 * 100).toFixed(1) }% of variance)
- **Error (RMSE):** $${Math.round(modelCoefficients.standard.rmse).toLocaleString()}
- **Formula:** 
  ${standardFormula}

### Model 2: Smoker-BMI Interaction Model (Recommended)
- **R² Score:** ${(modelCoefficients.interaction.r2 * 100).toFixed(2)}% (explains ${ (modelCoefficients.interaction.r2 * 100).toFixed(1) }% of variance)
- **Error (RMSE):** $${Math.round(modelCoefficients.interaction.rmse).toLocaleString()}
- **Formula:**
  ${interactionFormula}

## 4. Underwriting Recommendations
1. **Smoker-Obesity Premium Multipliers:** Avoid flat smoker surcharges. Implement a compounding rate factor reflecting the interaction term (+$1,464.73 per BMI unit for smokers).
2. **Integrated Cessation Wellness Programs:** Jointly incentivize weight management and tobacco cessation, as quitting smoking yields a baseline premium drop of $21,412 plus an additional $1,464 per BMI unit.
`;
  }, [filteredData, tTestResult]);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Report Generator Header */}
      <div className="flex justify-between items-center bg-slate-900/25 border border-slate-900 rounded-xl p-4">
        <div>
          <h2 className="text-sm font-extrabold text-slate-200">Cohort Insights & Diagnostics</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Explore hypothesis test statistics, correlation structures, and residual diagnostics</p>
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          Export Executive Report
        </button>
      </div>

      {/* Hypothesis Testing & Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Welch's T-Test Card */}
        <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Award className="w-4 h-4 text-indigo-400" /> Hypothesis Testing (CO4)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-300">
            <p className="leading-relaxed">
              **Null Hypothesis (\(H_0\)):** Mean medical charges of smokers and non-smokers in the cohort are equal.  
              <span className="block mt-1">**Alternative Hypothesis (\(H_a\)):** Mean charges of smokers are significantly greater than non-smokers.</span>
            </p>
            {filteredData.length >= 4 ? (
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 space-y-3">
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-900">
                    <div className="text-[9px] text-slate-500 uppercase tracking-wide">T-Statistic</div>
                    <div className="text-xs font-bold text-indigo-400 mt-1">{tTestResult.tStat.toFixed(4)}</div>
                  </div>
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-900">
                    <div className="text-[9px] text-slate-500 uppercase tracking-wide">Deg. of Freedom</div>
                    <div className="text-xs font-bold text-slate-300 mt-1">{tTestResult.df.toFixed(1)}</div>
                  </div>
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-900">
                    <div className="text-[9px] text-slate-500 uppercase tracking-wide">P-Value</div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">
                      {tTestResult.pValue < 0.0001 ? "< 0.0001" : tTestResult.pValue.toFixed(4)}
                    </div>
                  </div>
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  {tTestResult.pValue < 0.05 ? (
                    <p className="text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      ✅ Reject H₀: There is a statistically significant difference in claims (p &lt; 0.05).
                    </p>
                  ) : (
                    <p className="text-rose-400 font-semibold flex items-center gap-1 mt-1">
                      ⚠️ Fail to Reject H₀: No statistically significant difference in claims detected (p &ge; 0.05).
                    </p>
                  )}
                  <p className="text-[9px] text-slate-500 mt-2">
                    *Computed dynamically using Welch's T-Test (assumes unequal variances).
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/20 p-4 rounded text-center text-slate-500">
                Insufficient data to run T-Test.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dynamic Pearson Correlation Matrix */}
        <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Percent className="w-4 h-4 text-teal-400" /> Pearson Correlation Matrix (CO5)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredData.length >= 2 && correlationMatrix.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-6 gap-1 w-full max-w-sm text-center text-[10px]">
                  <div></div>
                  {correlationVariables.map((v) => (
                    <div key={v.label} className="font-bold text-slate-400 py-1">{v.label}</div>
                  ))}

                  {/* Grid Cells */}
                  {correlationVariables.map((rowVar, i) => (
                    <Fragment key={rowVar.key}>
                      <div className="font-bold text-slate-400 text-right pr-2 py-2 flex items-center justify-end">{rowVar.label}</div>
                      {correlationVariables.map((colVar, j) => {
                        const val = correlationMatrix[i][j];
                        return (
                          <div
                            key={`${i}-${j}`}
                            style={{ backgroundColor: getHeatmapColor(val) }}
                            className="text-white font-mono rounded flex items-center justify-center h-8 font-bold shadow-inner transition-transform hover:scale-105 cursor-help"
                            title={`Correlation between ${rowVar.label} and ${colVar.label}: ${val.toFixed(4)}`}
                          >
                            {val.toFixed(2)}
                          </div>
                        );
                      })}
                    </Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-6 text-xs">
                Insufficient cohort size to calculate correlation matrix.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scatter Plot Age vs Charges */}
        <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs font-bold text-slate-300">Age vs. Charges by Smoking Status</CardTitle>
          </CardHeader>
          <CardContent>
            {scatterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="age" stroke="#94a3b8" name="Age" unit="y" />
                  <YAxis dataKey="charges" stroke="#94a3b8" name="Charges" unit="$" />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} />
                  <Legend />
                  <Scatter name="Non-Smoker" data={scatterData.filter((d) => d.smoker === "no")} fill="#10b981" shape="circle" />
                  <Scatter name="Smoker" data={scatterData.filter((d) => d.smoker === "yes")} fill="#ef4444" shape="circle" />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 py-12 text-xs">No data available to plot</div>
            )}
          </CardContent>
        </Card>

        {/* Pie and Bar Chart Column */}
        <div className="space-y-6">
          {/* Average Cost bar chart */}
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Average Claim Cost comparison</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={smokerImpactData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="category" type="category" stroke="#94a3b8" width={80} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                  <Bar dataKey="avgCharge" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Pie Chart */}
          <Card className="bg-slate-900/40 border-slate-800">
            <CardHeader className="py-3">
              <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-4">
              {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-500 py-6 text-xs">No data to display</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Regression Diagnostics Section (CO6) */}
      <Card className="bg-slate-900/40 border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <RefreshCw className="w-4 h-4 text-indigo-400" /> Regression Diagnostics & Residuals (CO6)
            </CardTitle>
            <p className="text-[10px] text-slate-500 mt-1">
              Verify Ordinary Least Squares assumptions (linearity and homoscedasticity) dynamically.
            </p>
          </div>

          {/* Model Selector Toggle */}
          <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-xl">
            <button
              onClick={() => setSelectedDiagModel("standard")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                selectedDiagModel === "standard"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Standard Model
            </button>
            <button
              onClick={() => setSelectedDiagModel("interaction")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                selectedDiagModel === "interaction"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Interaction Model
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {diagPlotData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Actual vs Predicted */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-300 text-center">Actual vs. Predicted Charges</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="predicted" stroke="#94a3b8" name="Predicted" unit="$" domain={[0, 65000]} type="number" />
                    <YAxis dataKey="charges" stroke="#94a3b8" name="Actual" unit="$" domain={[0, 65000]} type="number" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                    <Scatter name="Perfect Fit Reference" data={diagonalLineData} fill="none" line={{ stroke: "#64748b", strokeDasharray: "4 4" }} shape={() => null} />
                    <Scatter name="Observations" data={diagPlotData} fill="#3b82f6" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="text-[9px] text-slate-500 text-center leading-relaxed">
                  *Points closer to the dashed diagonal line represent higher accuracy. The Interaction Model ($R^2={ (modelCoefficients.interaction.r2*100).toFixed(1) }\%$) aligns closer than the Standard Model ($R^2={ (modelCoefficients.standard.r2*100).toFixed(1) }\%$).
                </p>
              </div>

              {/* Residuals vs Fitted */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-300 text-center">Residuals vs. Fitted (Fitted Errors)</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="predicted" stroke="#94a3b8" name="Fitted Value" unit="$" domain={[0, 65000]} type="number" />
                    <YAxis dataKey="residual" stroke="#94a3b8" name="Residual" unit="$" domain={[-20000, 20000]} type="number" />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                    <Scatter name="Residuals" data={diagPlotData} fill="#a855f7" shape="circle" />
                    <Scatter name="Zero Reference" data={[{ predicted: 0, residual: 0 }, { predicted: 65000, residual: 0 }]} fill="none" line={{ stroke: "#ef4444", strokeDasharray: "4 4" }} shape={() => null} />
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="text-[9px] text-slate-500 text-center leading-relaxed">
                  *Evaluates **Homoscedasticity**. In the Standard model, note the three distinct curved bands (showing model bias). The Interaction model disperses points much more evenly around $y=0$ (constant variance).
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12 text-xs">No cohort data to plot diagnostics</div>
          )}
        </CardContent>
      </Card>

      {/* Markdown Report Modal Overlay */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-bold text-slate-200">Executive Report Markdown Preview</span>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 font-mono text-[10px] text-slate-300 bg-slate-950/40 select-all leading-relaxed whitespace-pre-wrap">
              {reportMarkdown}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-800 p-4 flex justify-between items-center bg-slate-900/60">
              <span className="text-[10px] text-slate-500">Copy this Markdown into your reports or print directly.</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyReport}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-3.5 h-3.5" /> Copy Report
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
