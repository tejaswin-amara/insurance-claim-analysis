import { useMemo } from "react";
import { insuranceData } from "@/data/insuranceData";
import { Card } from "@/components/ui/card";
import { MapPin, Users, DollarSign, Activity } from "lucide-react";

interface RegionalMapProps {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

interface RegionStats {
  count: number;
  avgCharges: number;
  smokerRate: number;
  avgBmi: number;
}

export default function RegionalMap({ selectedRegion, onSelectRegion }: RegionalMapProps) {
  // Pre-calculate regional stats on load
  const regionalStats = useMemo(() => {
    const stats: Record<string, RegionStats> = {
      northeast: { count: 0, avgCharges: 0, smokerRate: 0, avgBmi: 0 },
      northwest: { count: 0, avgCharges: 0, smokerRate: 0, avgBmi: 0 },
      southeast: { count: 0, avgCharges: 0, smokerRate: 0, avgBmi: 0 },
      southwest: { count: 0, avgCharges: 0, smokerRate: 0, avgBmi: 0 },
    };

    const sums: Record<string, { charges: number; smokers: number; bmi: number }> = {
      northeast: { charges: 0, smokers: 0, bmi: 0 },
      northwest: { charges: 0, smokers: 0, bmi: 0 },
      southeast: { charges: 0, smokers: 0, bmi: 0 },
      southwest: { charges: 0, smokers: 0, bmi: 0 },
    };

    insuranceData.forEach((item) => {
      const reg = item.region;
      if (stats[reg]) {
        stats[reg].count++;
        sums[reg].charges += item.charges;
        sums[reg].bmi += item.bmi;
        if (item.smoker === "yes") {
          sums[reg].smokers++;
        }
      }
    });

    Object.keys(stats).forEach((reg) => {
      const count = stats[reg].count;
      if (count > 0) {
        stats[reg].avgCharges = sums[reg].charges / count;
        stats[reg].avgBmi = sums[reg].bmi / count;
        stats[reg].smokerRate = sums[reg].smokers / count;
      }
    });

    return stats;
  }, []);

  const regions = [
    {
      id: "northwest",
      name: "Northwest",
      abbrev: "NW",
      color: "from-blue-600 to-cyan-500",
      stroke: "#2563eb",
      // Path represents top-left US
      path: "M 35,50 C 45,35 90,32 185,32 L 185,115 L 75,115 C 55,105 35,70 35,50 Z",
      translate: "hover:-translate-x-1 hover:-translate-y-1",
      tooltipPos: "top-4 left-4",
    },
    {
      id: "northeast",
      name: "Northeast",
      abbrev: "NE",
      color: "from-indigo-600 to-purple-500",
      stroke: "#4f46e5",
      // Path represents top-right US
      path: "M 195,32 C 260,32 315,40 365,55 C 375,75 365,95 345,105 C 325,115 250,115 195,115 Z",
      translate: "hover:translate-x-1 hover:-translate-y-1",
      tooltipPos: "top-4 right-4",
    },
    {
      id: "southwest",
      name: "Southwest",
      abbrev: "SW",
      color: "from-teal-600 to-emerald-500",
      stroke: "#0d9488",
      // Path represents bottom-left US
      path: "M 75,125 L 185,125 L 185,195 C 150,200 120,185 92,170 C 82,150 75,135 75,125 Z",
      translate: "hover:-translate-x-1 hover:translate-y-1",
      tooltipPos: "bottom-4 left-4",
    },
    {
      id: "southeast",
      name: "Southeast",
      abbrev: "SE",
      color: "from-emerald-600 to-green-500",
      stroke: "#059669",
      // Path represents bottom-right US (includes Florida)
      path: "M 195,125 L 345,115 C 345,135 335,150 340,180 C 330,205 315,210 305,210 C 295,185 285,175 265,175 C 235,180 205,185 195,195 Z",
      translate: "hover:translate-x-1 hover:translate-y-1",
      tooltipPos: "bottom-4 right-4",
    },
  ];

  const activeRegionData = selectedRegion !== "all" ? regionalStats[selectedRegion] : null;

  return (
    <Card className="bg-slate-900/40 border-slate-800 p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
      {/* SVG Map Section */}
      <div className="relative w-full max-w-[380px] aspect-[400/230]">
        <svg viewBox="0 0 400 230" className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          <g>
            {regions.map((r) => {
              const isActive = selectedRegion === r.id;
              const isAnyActive = selectedRegion !== "all";
              const stats = regionalStats[r.id];
              return (
                <path
                  key={r.id}
                  d={r.path}
                  className={`transition-all duration-300 cursor-pointer stroke-2 ${r.translate}`}
                  stroke={r.stroke}
                  fill={
                    isActive
                      ? `url(#grad-${r.id})`
                      : isAnyActive
                      ? "rgba(30, 41, 59, 0.2)"
                      : "rgba(30, 41, 59, 0.7)"
                  }
                  fillOpacity={isActive ? 1 : isAnyActive ? 0.3 : 0.85}
                  onClick={() => onSelectRegion(isActive ? "all" : r.id)}
                  title={`${r.name} Region`}
                />
              );
            })}
          </g>

          {/* Gradients definition */}
          <defs>
            {regions.map((r) => (
              <linearGradient key={r.id} id={`grad-${r.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="stop-color-start" style={{ stopColor: r.id === "northwest" ? "#2563eb" : r.id === "northeast" ? "#4f46e5" : r.id === "southwest" ? "#0d9488" : "#059669" }} />
                <stop offset="100%" className="stop-color-end" style={{ stopColor: r.id === "northwest" ? "#06b6d4" : r.id === "northeast" ? "#a855f7" : r.id === "southwest" ? "#10b981" : "#84cc16" }} />
              </linearGradient>
            ))}
          </defs>
        </svg>

        {/* Floating Mini Map Labels */}
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelectRegion(selectedRegion === r.id ? "all" : r.id)}
            className={`absolute pointer-events-auto text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border transition-all duration-300 ${
              r.id === "northwest"
                ? "top-[25%] left-[25%]"
                : r.id === "northeast"
                ? "top-[25%] right-[25%]"
                : r.id === "southwest"
                ? "bottom-[30%] left-[30%]"
                : "bottom-[30%] right-[30%]"
            } ${
              selectedRegion === r.id
                ? "bg-slate-100 border-white text-slate-950 shadow-md scale-105"
                : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            {r.abbrev}
          </button>
        ))}
      </div>

      {/* Info Panel Section */}
      <div className="flex-1 w-full space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-400" />
            {selectedRegion === "all" ? "Geographic Claims Dashboard" : `${regions.find(r => r.id === selectedRegion)?.name} Analysis`}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {selectedRegion === "all"
              ? "Click any region on the map to filter the active cohort and analyze regional statistics."
              : "Showing statistical outcomes for the selected region. Click the map again to deselect."}
          </p>
        </div>

        {selectedRegion === "all" ? (
          /* Baseline National Overview */
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/50 border border-slate-850 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">Total Beneficiaries</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-base font-extrabold text-slate-200">1,337</span>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-850 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">Avg National Claims</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-base font-extrabold text-slate-200">$13,279</span>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-850 p-3 rounded-xl col-span-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Highest Regional Cost:</span>
                <span className="text-slate-300 font-bold">Southeast ($14,735)</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>Highest Smoker Rate:</span>
                <span className="text-slate-300 font-bold">Southeast (25.0%)</span>
              </div>
            </div>
          </div>
        ) : (
          /* Active Region Detailed Panel */
          activeRegionData && (
            <div className="grid grid-cols-2 gap-3 animate-fadeIn">
              {/* Sample size */}
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Regional Sample</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-sm font-extrabold text-slate-200">{activeRegionData.count}</span>
                  <span className="text-[10px] text-slate-500">({Math.round((activeRegionData.count / 1337) * 100)}%)</span>
                </div>
              </div>

              {/* Average Claims */}
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Avg Claim Cost</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-sm font-extrabold text-slate-200">
                    ${Math.round(activeRegionData.avgCharges).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Smoker rate */}
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Smoker Ratio</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-sm font-extrabold text-slate-200">
                    {(activeRegionData.smokerRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Avg BMI */}
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Average BMI</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-sm font-extrabold text-slate-200">
                    {activeRegionData.avgBmi.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
}
