import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

export const FakeDocsPanicOverlay = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#f8f9fa] text-[#202124] font-sans flex flex-col select-text overflow-y-auto">
      {/* Top Docs App Bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-[#dadce0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#4285f4] text-white rounded">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-base font-medium text-[#202124]">
              Analysis of Renewable Energy Infrastructure (Draft 2.4)
            </div>
            <div className="flex items-center gap-4 text-xs text-[#5f6368] mt-0.5">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Tools</span>
              <span>Extensions</span>
              <span>Help</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#5f6368]">Last edit was 2 minutes ago</span>
          <button 
            onClick={onDismiss}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-medium rounded-full shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Games</span>
          </button>
        </div>
      </header>

      {/* Formatting toolbar */}
      <div className="flex items-center gap-3 px-6 py-1.5 bg-[#edf2fc] border-b border-[#dadce0] text-xs text-[#444746] shrink-0">
        <span className="font-mono">100%</span>
        <span>|</span>
        <span>Normal text</span>
        <span>|</span>
        <span>Arial</span>
        <span>|</span>
        <span className="font-bold">11</span>
        <span>|</span>
        <span className="font-bold">B</span>
        <span className="italic">I</span>
        <span className="underline">U</span>
      </div>

      {/* Document Page Canvas */}
      <main className="flex-1 p-6 md:p-10 bg-[#f8f9fa] flex justify-center">
        <div className="w-full max-w-3xl bg-white shadow-md border border-[#dadce0] p-10 md:p-16 rounded min-h-[900px] leading-relaxed text-[#202124] text-[15px]">
          <h1 className="text-2xl font-bold mb-4 text-[#1a73e8]">
            An Empirical Evaluation of Grid Decentralization & Clean Storage
          </h1>
          <p className="text-xs text-[#5f6368] mb-8 font-mono">
            Author: Student Research Group · Course: AP Environmental Science & Policy
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">1. Abstract</h2>
          <p className="mb-4">
            The ongoing transition toward distributed renewable generation introduces non-trivial grid balancing challenges. Through high-frequency telemetry across wind, solar, and utility-scale lithium-iron-phosphate battery reserves, this paper models regional dispatch volatility and demonstrates how load shifting decreases peaking plant combustion emissions by up to 34.2%.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">2. Methodology & Quantitative Sampling</h2>
          <p className="mb-4">
            We sampled hourly generation profiles across 14 municipal utility zones between Q1 and Q3. Power variance was normalized using standard deviation deviations from the regional base load, factoring in meteorological cloud cover indices and seasonal cooling degree day differentials.
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">3. Storage Interconnects & Battery Chemistry</h2>
          <p className="mb-4">
            Four-hour duration utility storage configurations demonstrate superior economic returns compared to simple gas-fired combustion turbines when grid frequency regulations are maintained within ±0.05 Hz tolerances.
          </p>

          <div className="mt-12 pt-6 border-t border-[#dadce0] flex items-center justify-between text-xs text-[#5f6368]">
            <span>Page 1 of 4</span>
            <button 
              onClick={onDismiss}
              className="text-[#1a73e8] hover:underline font-medium"
            >
              Resume Game Session (Click here or press Esc)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
