import { useMemo, useState, Fragment } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { insuranceData, InsuranceRecord } from "@/data/insuranceData";
import { computeWelchTTest, computePearsonCorrelation } from "@/lib/statistics";
import { TrendingUp, Percent, Award, AlertTriangle } from "lucide-react";

interface AnalyticsVisualsProps {
  // We can pass filters or inherit them. Let's let the user filter inside this component or pass the filtered data
  // Passing filteredData as a prop makes it highly integrated and consistent with CohortExplorer!
  filteredData: InsuranceRecord[];
}

export default function AnalyticsVisuals({ filteredData }: AnalyticsVisualsProps) {
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
    // Determinisitic sampling: take every N-th item
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

  return (
    <div className="space-y-8">
      {/* Hypothesis Testing & Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Welch's T-Test Card */}
        <Card className="bg-slate-900/40 border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-200 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-indigo-400" /> Hypothesis Testing (CO4)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-300">
            <p>
              **Null Hypothesis (\(H_0\)):** Mean medical charges of smokers and non-smokers in the cohort are equal.  
              **Alternative Hypothesis (\(H_a\)):** Mean charges of smokers are significantly greater than non-smokers.
            </p>
            {filteredData.length >= 4 ? (
              <div className="bg-slate-900/50 p-4 rounded border border-slate-800 space-y-3">
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="bg-slate-900 p-2 rounded">
                    <div className="text-[10px] text-slate-500">T-Statistic</div>
                    <div className="text-sm font-bold text-indigo-400 mt-1">{tTestResult.tStat.toFixed(4)}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded">
                    <div className="text-[10px] text-slate-500">Deg. of Freedom</div>
                    <div className="text-sm font-bold text-slate-300 mt-1">{tTestResult.df.toFixed(1)}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded">
                    <div className="text-[10px] text-slate-500">P-Value</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">
                      {tTestResult.pValue < 0.0001 ? "< 0.0001" : tTestResult.pValue.toFixed(4)}
                    </div>
                  </div>
                </div>
                <div className="text-slate-300 text-xs">
                  {tTestResult.pValue < 0.05 ? (
                    <p className="text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      ✅ Reject H₀: There is a statistically significant difference in claims (p &lt; 0.05).
                    </p>
                  ) : (
                    <p className="text-rose-400 font-semibold flex items-center gap-1 mt-1">
                      ⚠️ Fail to Reject H₀: No statistically significant difference in claims detected (p &ge; 0.05).
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500 mt-2">
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
            <CardTitle className="text-base font-bold text-slate-200 flex items-center gap-1.5">
              <Percent className="w-5 h-5 text-teal-400" /> Pearson Correlation Matrix (CO5)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredData.length >= 2 && correlationMatrix.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-6 gap-1 w-full max-w-sm text-center text-[10px]">
                  {/* Empty corner cell */}
                  <div></div>
                  {correlationVariables.map((v) => (
                    <div key={v.label} className="font-bold text-slate-400 py-1">{v.label}</div>
                  ))}

                  {/* Grid Cells */}
                  {correlationVariables.map((rowVar, i) => (
                    <Fragment key={rowVar.key}>
                      <div key={rowVar.label} className="font-bold text-slate-400 text-right pr-2 py-2 flex items-center justify-end">{rowVar.label}</div>
                      {correlationVariables.map((colVar, j) => {
                        const val = correlationMatrix[i][j];
                        return (
                          <div
                            key={`${i}-${j}`}
                            style={{ backgroundColor: getHeatmapColor(val) }}
                            className="text-white font-mono rounded flex items-center justify-center h-8 font-semibold shadow-inner transition-transform hover:scale-105"
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
            <CardTitle className="text-sm font-bold text-slate-300">Age vs. Charges by Smoking Status</CardTitle>
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
              <CardTitle className="text-xs font-bold text-slate-400">Average Claim Cost comparison</CardTitle>
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
              <CardTitle className="text-xs font-bold text-slate-400">Risk Distribution</CardTitle>
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
    </div>
  );
}
