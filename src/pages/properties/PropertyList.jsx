
import { useEffect, useState } from "react";
import { fetchProperties } from "../../api/propertyApi";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import Pagination from "../../components/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import AreaInsights from "../../components/ai/AreaInsights";

export default function PropertyList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    property_type: searchParams.get("property_type") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const page = Number(searchParams.get("page") || 1);

  const load = async (override = {}) => {
    setLoading(true);

    const params = {
      ...filters,
      ...override,
      search: debouncedSearch,
      page,
      ordering: searchParams.get("ordering") || "-created_at",
    };

    Object.keys(params).forEach(
      (k) => params[k] === "" && delete params[k]
    );

    const res = await fetchProperties(params);
    setProperties(res.data.results);
    setCount(res.data.count);
    setLoading(false);
  };

 
useEffect(() => {
  //  Do nothing if search is empty
  if (!debouncedSearch) return;

  setSearchParams((prev) => {
    const next = Object.fromEntries(prev);
    next.search = debouncedSearch;
    next.page = 1;
    return next;
  });
}, [debouncedSearch]);


  /*  LOAD ON PARAM CHANGE */
  useEffect(() => {
    load();
  }, [searchParams]);

  const applyFilters = () => {
    setSearchParams({
      ...filters,
      search: debouncedSearch,
      page: 1,
    });
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-12 bg-bg-page">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary">
            Available Properties
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Browse through our exclusive list of verified properties
          </p>
        </div>
<AreaInsights /> 
        {/* Filters */}
        <PropertyFilters
          filters={filters}
          setFilters={setFilters}
          onApply={applyFilters}
        />

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onView={() =>
                    navigate(`/properties/${property.id}`)
                  }
                />
              ))}
            </div>

            <Pagination
              page={page}
              total={count}
              onPage={(p) =>
                setSearchParams({ ...filters, page: p })
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
