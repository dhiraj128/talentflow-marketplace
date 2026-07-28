import React from "react";
import { Search, X } from "lucide-react";

interface MarketplaceSearchProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  onClear?: () => void;
}

export function MarketplaceSearch({ value, onChange, onSearch, onClear }: MarketplaceSearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[960px] mx-auto">
      <div className="relative flex flex-col md:flex-row md:items-stretch w-full gap-3 md:gap-0 md:h-[64px] md:bg-white md:rounded-2xl md:shadow-xl md:shadow-purple-950/10 md:border md:border-slate-200/80 md:overflow-hidden md:focus-within:ring-2 md:focus-within:ring-purple-500/40 transition-all">
        
        {/* Input Section */}
        <div className="relative flex-1 w-full flex items-center bg-white rounded-xl md:rounded-none shadow-md md:shadow-none border border-slate-200/80 md:border-0 h-[52px] min-h-[52px] md:h-full overflow-hidden shrink-0">
          <Search className="absolute left-4 md:left-5 text-slate-400 w-5 h-5 md:w-6 md:h-6 shrink-0 pointer-events-none top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search freelancers by skill, title, company or keyword..."
            className="h-[52px] min-h-[52px] md:h-full w-full pl-12 md:pl-14 pr-10 md:pr-12 border-0 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm md:text-base font-normal outline-none focus:outline-none focus:ring-0 rounded-none shadow-none truncate"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                onClear?.();
              }}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>

        {/* Button Section */}
        <button
          type="submit"
          className="h-[52px] min-h-[52px] md:h-full w-full md:w-[180px] rounded-xl md:rounded-none bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-base md:text-lg border-0 m-0 p-0 flex items-center justify-center shrink-0 shadow-md md:shadow-none transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}
