import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insuranceData } from "@/data/insuranceData";
import PredictionPlayground from "@/components/PredictionPlayground";
import CohortExplorer from "@/components/CohortExplorer";
import AnalyticsVisuals from "@/components/AnalyticsVisuals";
import AcademicMapping from "@/components/AcademicMapping";
import RegionalMap from "@/components/RegionalMap";
import { Calculator, Table, BarChart3, GraduationCap, Filter, Sparkles } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("playground");

  // Shared Filter States for Cohort Analysis
  const [sex, setSex] = useState<string>("all");
  const [smoker, setSmoker] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(64);

  // Compute filtered dataset
  const filteredData = useMemo(() => {
    return insuranceData.filter((item) => {
      if (sex !== "all" && item.sex !== sex) return false;
      if (smoker !== "all" && item.smoker !== smoker) return false;
      if (region !== "all" && item.region !== region) return false;
      if (item.age < minAge || item.age > maxAge) return false;
      return true;
    });
  }, [sex, smoker, region, minAge, maxAge]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/15">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Insurance Risk Intelligence
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-0.5">
                MDSA Capstone | KLH University
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-slate-500 text-xs font-medium border-l border-slate-900 pl-6 h-8">
            <div>
              <span className="text-[10px] text-slate-600 block uppercase tracking-wide">Developer</span>
              <span className="text-slate-300">Tejaswin Amara</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-600 block uppercase tracking-wide">Roll Number</span>
              <span className="text-slate-300">2520090104</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tab Bar */}
      <nav className="bg-slate-950/50 border-b border-slate-900 py-3 sticky top-[69px] z-40 backdrop-blur-sm">
        <div className="container flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: "playground", label: "Prediction Playground", icon: Calculator },
            { id: "explorer", label: "Cohort Explorer", icon: Table },
            { id: "analytics", label: "Statistical Analytics", icon: BarChart3 },
            { id: "academic", label: "Academic Outcomes", icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 shrink-0 select-none ${
                  active
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container flex-1 py-8 space-y-8">
        {/* Conditional Shared Filters and Map for explorer/analytics tabs */}
        {(activeTab === "explorer" || activeTab === "analytics") && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <RegionalMap selectedRegion={region} onSelectRegion={setRegion} />
            </div>

            <Card className="bg-slate-900/30 border-slate-900 p-5 shadow-md flex flex-col justify-center space-y-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <Filter className="w-3.5 h-3.5 text-blue-400" /> Filter Controls:
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Smoker */}
                <div className="space-y-1.5">
                  <Label className="text-slate-500 text-[11px]">Tobacco</Label>
                  <Select value={smoker} onValueChange={setSmoker}>
                    <SelectTrigger className="w-full bg-slate-950 border-slate-850 text-slate-300 h-8 text-[11px] rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-850">
                      <SelectItem value="all" className="text-xs">All Profiles</SelectItem>
                      <SelectItem value="yes" className="text-xs">Smokers Only</SelectItem>
                      <SelectItem value="no" className="text-xs">Non-Smokers Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sex */}
                <div className="space-y-1.5">
                  <Label className="text-slate-500 text-[11px]">Sex</Label>
                  <Select value={sex} onValueChange={setSex}>
                    <SelectTrigger className="w-full bg-slate-950 border-slate-850 text-slate-300 h-8 text-[11px] rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-850">
                      <SelectItem value="all" className="text-xs">Both</SelectItem>
                      <SelectItem value="male" className="text-xs">Male</SelectItem>
                      <SelectItem value="female" className="text-xs">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Region Dropdown (synced with Map) */}
                <div className="space-y-1.5">
                  <Label className="text-slate-500 text-[11px]">Region Dropdown</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="w-full bg-slate-950 border-slate-850 text-slate-300 h-8 text-[11px] rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-slate-850">
                      <SelectItem value="all" className="text-xs">All US Regions</SelectItem>
                      <SelectItem value="northeast" className="text-xs">Northeast</SelectItem>
                      <SelectItem value="northwest" className="text-xs">Northwest</SelectItem>
                      <SelectItem value="southeast" className="text-xs">Southeast</SelectItem>
                      <SelectItem value="southwest" className="text-xs">Southwest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age limits */}
                <div className="space-y-1.5">
                  <Label className="text-slate-500 text-[11px]">Age Cohort</Label>
                  <div className="flex items-center gap-1 bg-slate-950 px-2 border border-slate-850 rounded-lg h-8 w-full justify-between">
                    <input
                      type="number"
                      value={minAge}
                      onChange={(e) => setMinAge(Math.max(18, Math.min(maxAge, Number(e.target.value))))}
                      className="w-8 bg-transparent text-center text-slate-300 focus:outline-none text-[11px]"
                      min={18}
                      max={64}
                    />
                    <span className="text-slate-700 text-[10px]">to</span>
                    <input
                      type="number"
                      value={maxAge}
                      onChange={(e) => setMaxAge(Math.max(minAge, Math.min(64, Number(e.target.value))))}
                      className="w-8 bg-transparent text-center text-slate-300 focus:outline-none text-[11px]"
                      min={18}
                      max={64}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Render Active Tab Component */}
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === "playground" && <PredictionPlayground />}
          {activeTab === "explorer" && <CohortExplorer filteredData={filteredData} />}
          {activeTab === "analytics" && <AnalyticsVisuals filteredData={filteredData} />}
          {activeTab === "academic" && <AcademicMapping />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-auto">
        <div className="container text-center text-xs text-slate-500 space-y-2">
          <p>
            &copy; 2026 Insurance Risk Analytics Platform. Developed as a Mathematics for Data Science & Analytics Capstone Project.
          </p>
          <p>
            KLH University (Bachupally Campus) &bull; Major: CSIT &bull; All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
