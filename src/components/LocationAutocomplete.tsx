import { useState, useEffect, useRef } from "react";

// Debounce hook
function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function LocationAutocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const resultsRef = useRef<HTMLUListElement | null>(null);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const fetchSuggestions = async (value: string) => {
      if (value.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(value)}`,
          {
            headers: {
              Authorization: import.meta.env.VITE_RADAR_API_KEY || "",
            },
          }
        );
        const data = await res.json();
        setResults(data.addresses || []);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Radar Autocomplete error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        selectResult(results[activeIndex]);
      }
    }
  };

  const selectResult = (result: any) => {
    setQuery(result.addressLabel);
    setResults([]);
    setActiveIndex(-1);
    // send selection to backend if needed
  };

  return (
    <div className="w-full max-w-md relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your city, zip or address"
        className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        autoComplete="off"
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
      {results.length > 0 && (
        <ul
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 border rounded bg-white shadow max-h-60 overflow-y-auto"
        >
          {results.map((r, idx) => (
            <li
              key={r.addressLabel}
              className={`p-2 cursor-pointer ${
                idx === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => selectResult(r)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              {r.addressLabel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
