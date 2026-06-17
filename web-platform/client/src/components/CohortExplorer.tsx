import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InsuranceRecord } from "@/data/insuranceData";
import { computeSummaryStats } from "@/lib/statistics";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface CohortExplorerProps {
  filteredData: InsuranceRecord[];
}

export default function CohortExplorer({ filteredData }: CohortExplorerProps) {
  // Table Pagination & Sort state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<keyof InsuranceRecord>("charges");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const itemsPerPage = 10;

  // Reset page when filtered data length changes
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredData.length]);

  // Dynamic statistics on filtered cohort
  const stats = useMemo(() => {
    const charges = filteredData.map((d) => d.charges);
    return computeSummaryStats(charges);
  }, [filteredData]);

  // Sort data
  const sortedData = useMemo(() => {
    const data = [...filteredData];
    data.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
    return data;
  }, [filteredData, sortField, sortAsc]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handleSort = (field: keyof InsuranceRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const formatUSD = (val: number) =>
    val.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      {/* Metrics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/30 border-slate-800/80 p-4 shadow-md">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cohort Size</p>
          <p className="text-2xl font-extrabold text-blue-400 mt-1">{stats.count.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500 mt-1">Matched beneficiaries</p>
        </Card>
        <Card className="bg-slate-900/30 border-slate-800/80 p-4 shadow-md">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Mean Charge</p>
          <p className="text-2xl font-extrabold text-slate-100 mt-1">{formatUSD(stats.mean)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Average claim cost</p>
        </Card>
        <Card className="bg-slate-900/30 border-slate-800/80 p-4 shadow-md">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Median Charge</p>
          <p className="text-2xl font-extrabold text-slate-100 mt-1">{formatUSD(stats.median)}</p>
          <p className="text-[10px] text-slate-500 mt-1">50th percentile cost</p>
        </Card>
        <Card className="bg-slate-900/30 border-slate-800/80 p-4 shadow-md">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Std Deviation</p>
          <p className="text-2xl font-extrabold text-indigo-400 mt-1">{formatUSD(stats.stdDev)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Claim dispersion</p>
        </Card>
        <Card className="bg-slate-900/30 border-slate-800/80 p-4 shadow-md col-span-2 md:col-span-1">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cohort Skewness</p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{stats.skewness.toFixed(3)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Positive claim asymmetry</p>
        </Card>
      </div>

      {/* Data Grid Card */}
      <Card className="bg-slate-900/20 border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-900/60">
              <TableRow className="border-slate-850 hover:bg-slate-900/60">
                <TableHead className="w-16 text-slate-400 text-xs">#</TableHead>
                <TableHead className="text-slate-400 text-xs cursor-pointer hover:text-slate-200 select-none" onClick={() => handleSort("age")}>
                  Age <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </TableHead>
                <TableHead className="text-slate-400 text-xs cursor-pointer hover:text-slate-200 select-none" onClick={() => handleSort("sex")}>
                  Sex <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </TableHead>
                <TableHead className="text-slate-400 text-xs cursor-pointer hover:text-slate-200 select-none" onClick={() => handleSort("bmi")}>
                  BMI <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </TableHead>
                <TableHead className="text-slate-400 text-xs cursor-pointer hover:text-slate-200 select-none" onClick={() => handleSort("children")}>
                  Children <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </TableHead>
                <TableHead className="text-slate-400 text-xs cursor-pointer hover:text-slate-200 select-none" onClick={() => handleSort("smoker")}>
                  Smoker <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </TableHead>
                <TableHead className="text-slate-400 text-xs cursor-pointer hover:text-slate-200 select-none" onClick={() => handleSort("region")}>
                  Region <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </TableHead>
                <TableHead className="text-right text-slate-400 text-xs cursor-pointer hover:text-slate-200 select-none" onClick={() => handleSort("charges")}>
                  Charges <ArrowUpDown className="inline w-3 h-3 ml-1" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow key={index} className="border-slate-850 hover:bg-slate-800/30 text-slate-300">
                    <TableCell className="font-mono text-slate-500 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell className="text-xs font-medium">{item.age}</TableCell>
                    <TableCell className="capitalize text-xs">{item.sex}</TableCell>
                    <TableCell className="text-xs">{item.bmi.toFixed(2)}</TableCell>
                    <TableCell className="text-xs">{item.children}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${item.smoker === "yes" ? "bg-rose-500/15 text-rose-400 border border-rose-500/20" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"}`}>
                        {item.smoker === "yes" ? "SMOKER" : "NON-SMOKER"}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize text-xs">{item.region}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-slate-100 text-xs">{formatUSD(item.charges)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500 text-xs">
                    No beneficiary records matching selected filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900/40 border-t border-slate-850 text-xs">
            <span className="text-slate-500 text-[11px]">
              Showing <strong className="text-slate-300">{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
              <strong className="text-slate-300">{Math.min(currentPage * itemsPerPage, filteredData.length)}</strong> of{" "}
              <strong className="text-slate-300">{filteredData.length}</strong> records
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 h-8 text-[11px]"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-0.5" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 h-8 text-[11px]"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
