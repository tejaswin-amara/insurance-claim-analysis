import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertCircle, CheckCircle, DollarSign } from "lucide-react";

export default function Home() {
  const [age, setAge] = useState(35);
  const [bmi, setBmi] = useState(28);
  const [children, setChildren] = useState(1);
  const [smoker, setSmoker] = useState("no");
  const [prediction, setPrediction] = useState<number | null>(null);

  // Simple prediction model (based on the coefficients from the analysis)
  const predictCharge = () => {
    const smokerVal = smoker === "yes" ? 1 : 0;
    const baseCharge = -11947.16;
    const ageEffect = 256.86 * age;
    const bmiEffect = 335.56 * bmi;
    const childrenEffect = 425.23 * children;
    const smokerEffect = 23647.78 * smokerVal;
    
    const total = Math.max(0, baseCharge + ageEffect + bmiEffect + childrenEffect + smokerEffect);
    setPrediction(total);
  };

  // Sample data for visualizations
  const ageVsChargesData = [
    { age: 18, charges: 2500, smoker: "no" },
    { age: 25, charges: 5000, smoker: "no" },
    { age: 35, charges: 8000, smoker: "no" },
    { age: 45, charges: 12000, smoker: "no" },
    { age: 55, charges: 18000, smoker: "no" },
    { age: 18, charges: 28000, smoker: "yes" },
    { age: 25, charges: 32000, smoker: "yes" },
    { age: 35, charges: 38000, smoker: "yes" },
    { age: 45, charges: 45000, smoker: "yes" },
    { age: 55, charges: 52000, smoker: "yes" },
  ];

  const riskDistribution = [
    { name: "Low Risk (<$15k)", value: 450, fill: "#10b981" },
    { name: "Medium Risk ($15k-$30k)", value: 400, fill: "#f59e0b" },
    { name: "High Risk (>$30k)", value: 488, fill: "#ef4444" },
  ];

  const smokerImpact = [
    { category: "Non-Smoker", avgCharge: 8440.66 },
    { category: "Smoker", avgCharge: 32050.23 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Insurance Risk Intelligence</h1>
              <p className="text-slate-400 mt-1">MDSA Capstone Project | KLH University</p>
            </div>
            <div className="text-right text-slate-400 text-sm">
              <p>Author: Tejaswin Amara</p>
              <p>Roll: 2520090104</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-12">
        {/* Hero Section with Prediction Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Prediction Card */}
          <Card className="lg:col-span-1 bg-slate-800 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Live Prediction Engine</h2>
            <div className="space-y-6">
              <div>
                <Label className="text-slate-300 mb-2 block">Age</Label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min="18"
                  max="64"
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <p className="text-xs text-slate-400 mt-1">{age} years</p>
              </div>

              <div>
                <Label className="text-slate-300 mb-2 block">BMI</Label>
                <Input
                  type="number"
                  value={bmi}
                  onChange={(e) => setBmi(Number(e.target.value))}
                  min="15"
                  max="55"
                  step="0.1"
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <p className="text-xs text-slate-400 mt-1">{bmi.toFixed(1)}</p>
              </div>

              <div>
                <Label className="text-slate-300 mb-2 block">Children</Label>
                <Input
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  min="0"
                  max="5"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-300 mb-2 block">Smoking Status</Label>
                <Select value={smoker} onValueChange={setSmoker}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="no" className="text-white">Non-Smoker</SelectItem>
                    <SelectItem value="yes" className="text-white">Smoker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={predictCharge}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
              >
                Predict Charge
              </Button>

              {prediction !== null && (
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 mt-6">
                  <p className="text-slate-200 text-sm mb-2">Estimated Annual Charge</p>
                  <p className="text-4xl font-bold text-white">${prediction.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                  <p className="text-blue-200 text-xs mt-2">Based on Multiple Linear Regression Model (R² = 0.7827)</p>
                </div>
              )}
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Smoking Impact</p>
                    <p className="text-3xl font-bold text-red-400 mt-2">+$23,647</p>
                    <p className="text-xs text-slate-500 mt-1">Annual baseline increase</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-red-500/30" />
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Model Accuracy</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">78.3%</p>
                    <p className="text-xs text-slate-500 mt-1">R² Score</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-500/30" />
                </div>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Average Cost Comparison</h3>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={smokerImpact}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                  <Bar dataKey="avgCharge" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Age vs Charges */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Age vs. Charges (Smoking Impact)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="age" stroke="#94a3b8" name="Age" />
                <YAxis stroke="#94a3b8" name="Charges" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Legend />
                <Scatter name="Non-Smoker" data={ageVsChargesData.filter(d => d.smoker === "no")} fill="#10b981" />
                <Scatter name="Smoker" data={ageVsChargesData.filter(d => d.smoker === "yes")} fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>

          {/* Risk Distribution */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Risk Distribution (n=1,338)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Key Findings */}
        <Card className="bg-slate-800 border-slate-700 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Key Findings & Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-bold text-white mb-2">Primary Risk Factor</h4>
              <p className="text-slate-300 text-sm">Smoking status is the #1 predictor of high medical charges, contributing 3.8x higher baseline costs compared to non-smokers.</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-bold text-white mb-2">Compounding Effects</h4>
              <p className="text-slate-300 text-sm">High BMI (≥30) combined with smoking creates exponential cost increases, identifying a critical "High-Risk" cluster requiring intervention.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-white mb-2">Strategic Opportunity</h4>
              <p className="text-slate-300 text-sm">Wellness programs targeting smoking cessation and BMI reduction offer the highest ROI for long-term claim reduction.</p>
            </div>
          </div>
        </Card>

        {/* Course Outcomes */}
        <Card className="bg-slate-800 border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Course Outcomes Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700 p-4 rounded">
              <p className="font-bold text-blue-400">CO1: Data Preprocessing</p>
              <p className="text-slate-300 mt-2">Outlier detection (IQR), duplicate removal, data integrity validation.</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="font-bold text-blue-400">CO2: Descriptive Stats</p>
              <p className="text-slate-300 mt-2">Central tendency, dispersion, skewness analysis of charges.</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="font-bold text-blue-400">CO3: Probability</p>
              <p className="text-slate-300 mt-2">Bayes' Theorem verification, risk modeling, distributions.</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="font-bold text-blue-400">CO4: Statistical Inference</p>
              <p className="text-slate-300 mt-2">Hypothesis testing (t-tests), confidence intervals, CLT.</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="font-bold text-blue-400">CO5: Correlation</p>
              <p className="text-slate-300 mt-2">Pearson correlation, simple linear regression analysis.</p>
            </div>
            <div className="bg-slate-700 p-4 rounded">
              <p className="font-bold text-blue-400">CO6: ML Evaluation</p>
              <p className="text-slate-300 mt-2">Multiple regression, interaction terms, model diagnostics.</p>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-16 py-8">
        <div className="container text-center text-slate-400 text-sm">
          <p>Insurance Claim Analysis | MDSA Capstone Project | KLH University (Bachupally Campus)</p>
          <p className="mt-2">GitHub: <a href="https://github.com/tejaswin-amara/insurance-claim-analysis" className="text-blue-400 hover:text-blue-300">tejaswin-amara/insurance-claim-analysis</a></p>
        </div>
      </footer>
    </div>
  );
}
