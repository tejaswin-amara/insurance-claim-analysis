import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { modelCoefficients } from "@/data/insuranceData";
import { HelpCircle, Sparkles, DollarSign, Calculator } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function PredictionPlayground() {
  const [age, setAge] = useState(35);
  const [bmi, setBmi] = useState(28);
  const [children, setChildren] = useState(1);
  const [isSmoker, setIsSmoker] = useState(false);

  const coefs = modelCoefficients;
  const smokerVal = isSmoker ? 1 : 0;

  // Standard Model Calculation
  const stdBase = coefs.standard.intercept;
  const stdAgeEffect = coefs.standard.age * age;
  const stdBmiEffect = coefs.standard.bmi * bmi;
  const stdChildEffect = coefs.standard.children * children;
  const stdSmokerEffect = coefs.standard.smoker_yes * smokerVal;
  const stdTotal = Math.max(0, stdBase + stdAgeEffect + stdBmiEffect + stdChildEffect + stdSmokerEffect);

  // Interaction Model Calculation
  const intBase = coefs.interaction.intercept;
  const intAgeEffect = coefs.interaction.age * age;
  const intBmiEffect = coefs.interaction.bmi * bmi;
  const intChildEffect = coefs.interaction.children * children;
  const intSmokerEffect = coefs.interaction.smoker_yes * smokerVal;
  const intInteractionEffect = coefs.interaction.bmi_smoker_interaction * (bmi * smokerVal);
  const intTotal = Math.max(0, intBase + intAgeEffect + intBmiEffect + intChildEffect + intSmokerEffect + intInteractionEffect);

  // Format currency
  const formatUSD = (val: number) =>
    val.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  // Compute risk tier based on interaction total
  const getRiskTier = (total: number) => {
    if (total < 10000) return { name: "Low Risk", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    if (total < 25000) return { name: "Moderate Risk", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
    return { name: "High Risk", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
  };

  const risk = getRiskTier(intTotal);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs Column */}
      <Card className="lg:col-span-1 bg-slate-900/40 backdrop-blur-md border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
            <Calculator className="w-5 h-5 text-blue-400" />
            Demographics & Risk Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Age */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 font-medium">Age</Label>
              <span className="text-sm font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{age} years</span>
            </div>
            <Slider
              value={[age]}
              onValueChange={(val) => setAge(val[0])}
              min={18}
              max={65}
              step={1}
              className="py-2"
            />
          </div>

          {/* BMI */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 font-medium">BMI (Body Mass Index)</Label>
              <span className="text-sm font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">{bmi.toFixed(1)}</span>
            </div>
            <Slider
              value={[bmi]}
              onValueChange={(val) => setBmi(val[0])}
              min={15}
              max={50}
              step={0.5}
              className="py-2"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Underweight (&lt;18.5)</span>
              <span>Normal (18.5-24.9)</span>
              <span>Overweight (25-29.9)</span>
              <span>Obese (&ge;30)</span>
            </div>
          </div>

          {/* Children */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 font-medium">Dependents / Children</Label>
              <span className="text-sm font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{children}</span>
            </div>
            <Slider
              value={[children]}
              onValueChange={(val) => setChildren(val[0])}
              min={0}
              max={5}
              step={1}
              className="py-2"
            />
          </div>

          {/* Smoker Switch */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="space-y-0.5">
              <Label className="text-slate-300 font-medium">Tobacco Smoker</Label>
              <p className="text-xs text-slate-500">Activates compounding interaction effects</p>
            </div>
            <Switch
              checked={isSmoker}
              onCheckedChange={setIsSmoker}
              className="data-[state=checked]:bg-rose-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Predictions Display Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard model */}
          <Card className="bg-slate-900/30 border-slate-800 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standard Model</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">R² = {coefs.standard.r2.toFixed(3)}</span>
              </div>
              <CardTitle className="text-3xl font-extrabold text-slate-100 mt-2">
                {formatUSD(stdTotal)}
              </CardTitle>
              <p className="text-xs text-slate-500">Linear additive effects only</p>
            </CardHeader>
            <CardContent className="space-y-2 pt-2 border-t border-slate-900/60 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Intercept:</span> <span className="text-slate-300 font-mono">{formatUSD(stdBase)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Age ({age}y):</span> <span className="text-emerald-400 font-mono">+{formatUSD(stdAgeEffect)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">BMI ({bmi.toFixed(1)}):</span> <span className="text-emerald-400 font-mono">+{formatUSD(stdBmiEffect)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Children ({children}):</span> <span className="text-emerald-400 font-mono">+{formatUSD(stdChildEffect)}</span></div>
              {isSmoker && <div className="flex justify-between"><span className="text-slate-500">Smoker:</span> <span className="text-rose-400 font-mono">+{formatUSD(stdSmokerEffect)}</span></div>}
            </CardContent>
          </Card>

          {/* Advanced model */}
          <Card className="bg-gradient-to-b from-blue-950/20 to-slate-900/40 border-blue-900/40 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3. h-3" /> Advanced Model
                </span>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">R² = {coefs.interaction.r2.toFixed(3)}</span>
              </div>
              <CardTitle className="text-3xl font-extrabold text-blue-300 mt-2">
                {formatUSD(intTotal)}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-500">Includes Smoker-BMI interaction</p>
                <span className={`text-[10px] px-2 py-0.2 rounded-full border ${risk.color} font-medium`}>{risk.name}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-2 border-t border-slate-900/60 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Intercept:</span> <span className="text-slate-300 font-mono">{formatUSD(intBase)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Age ({age}y):</span> <span className="text-emerald-400 font-mono">+{formatUSD(intAgeEffect)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">BMI ({bmi.toFixed(1)}):</span> <span className={`${intBmiEffect >= 0 ? 'text-emerald-400' : 'text-red-400'} font-mono`}>{intBmiEffect >= 0 ? '+' : ''}{formatUSD(intBmiEffect)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Children ({children}):</span> <span className="text-emerald-400 font-mono">+{formatUSD(intChildEffect)}</span></div>
              {isSmoker && (
                <>
                  <div className="flex justify-between text-rose-300"><span className="text-slate-500">Smoker Penalty:</span> <span className="font-mono">{formatUSD(intSmokerEffect)}</span></div>
                  <div className="flex justify-between text-rose-400 font-semibold bg-rose-950/20 px-1 py-0.5 rounded"><span className="text-slate-400">BMI &times; Smoker:</span> <span className="font-mono">+{formatUSD(intInteractionEffect)}</span></div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Explain the Math Card */}
        <Card className="bg-slate-900/40 border-slate-800/80">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              Statistical Insight: Why the Difference?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 text-xs leading-relaxed space-y-4">
            {isSmoker ? (
              <p>
                🚨 **The Compounding Smoker-BMI Effect:** In the standard model, obesity (BMI &ge; 30) and smoking are treated as separate, additive costs. In reality, their interaction is **exponential**. The Advanced model reveals that while being a smoker with a very low BMI has a smaller effect (notice the negative smoker baseline penalty of {formatUSD(intSmokerEffect)}), every unit of BMI for a smoker adds a staggering **{formatUSD(coefs.interaction.bmi_smoker_interaction)}** per year! For your selected profile, the interaction adds **{formatUSD(intInteractionEffect)}**, showing why wellness plans must target obese smokers.
              </p>
            ) : (
              <p>
                ℹ️ **Baseline Non-Smoker Profile:** When Tobacco smoking is disabled, your charges remain relatively low. For non-smokers, the baseline BMI coefficient is virtually zero ({formatUSD(coefs.interaction.bmi)} per unit), meaning weight increases do not heavily impact claims unless smoking is introduced. This shows that the standard model overcharges healthy obese individuals, while the interaction model corrects this baseline difference.
              </p>
            )}

            {/* Waterfall-like bar display */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Visual Formula Breakdown (Advanced Model)</p>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span>Age Impact</span>
                  <span className="font-semibold text-emerald-400">{formatUSD(intAgeEffect)}</span>
                </div>
                <Progress value={Math.min(100, (intAgeEffect / 40000) * 100)} className="h-1 bg-slate-800 [&>div]:bg-emerald-500" />

                <div className="flex justify-between text-[10px]">
                  <span>Base Weight (BMI) Impact</span>
                  <span className={`font-semibold ${intBmiEffect >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatUSD(intBmiEffect)}</span>
                </div>
                <Progress value={Math.min(100, (Math.abs(intBmiEffect) / 40000) * 100)} className="h-1 bg-slate-800 [&>div]:bg-teal-500" />

                <div className="flex justify-between text-[10px]">
                  <span>Children/Dependents</span>
                  <span className="font-semibold text-emerald-400">{formatUSD(intChildEffect)}</span>
                </div>
                <Progress value={Math.min(100, (intChildEffect / 40000) * 100)} className="h-1 bg-slate-800 [&>div]:bg-indigo-500" />

                {isSmoker && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span>Smoking Status (Interaction Effect)</span>
                      <span className="font-semibold text-rose-400">+{formatUSD(intSmokerEffect + intInteractionEffect)}</span>
                    </div>
                    <Progress value={Math.min(100, ((intSmokerEffect + intInteractionEffect) / 40000) * 100)} className="h-1 bg-slate-800 [&>div]:bg-rose-500" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
