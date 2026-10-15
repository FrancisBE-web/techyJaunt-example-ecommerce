import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import { CATEGORIES } from "../catalog";
import CardSkeleton from "../components/CardSkeleton";
import ProductCard from "../components/ProductCard";

const SORTS = {
  new: { label: "Newest", fn: () => 0 },
  low: { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  high: { label: "Price: high to low", fn: (a, b) => b.price - a.price },
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const [sort, setSort] = useState("new");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const filter = category ? `&category=${category}` : "";
    api(`/api/v1/products?limit=50${filter}`)
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products
      .filter(
        (product) =>
          !needle ||
          product.name.toLowerCase().includes(needle) ||
          product.description.toLowerCase().includes(needle),
      )
      .sort(SORTS[sort].fn);
  }, [products, query, sort]);

  const pick = (id) => setParams(id ? { category: id } : {});
  const current = CATEGORIES.find((item) => item.id === category);

  return (
    <section className="section page wrap">
      <header className="shop-head">
        <div>
          <p className="eyebrow mono">Catalog</p>
          <h1 className="title">{current ? current.title : "Everything"}</h1>
        </div>
        <p className="mono muted">{loading ? "Loading…" : `${visible.length} results`}</p>
      </header>

      <div className="toolbar glass">
        <div className="chips" role="group" aria-label="Category">
          <button type="button" className={!category ? "chip on" : "chip"} onClick={() => pick("")}>
            All
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={category === item.id ? "chip on" : "chip"}
              style={{ "--accent": item.color }}
              onClick={() => pick(item.id)}
            >
              <span className="dot" />
              {item.title}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <input
            className="field search"
            type="search"
            placeholder="Search"
            aria-label="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="field select"
            aria-label="Sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {Object.entries(SORTS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <p className="notice glass">{error}</p> : null}
      {!loading && !error && visible.length === 0 ? (
        <p className="empty glass">Nothing matches that search.</p>
      ) : null}

      <div className="grid">
        {loading ? (
          <CardSkeleton count={9} />
        ) : (
          visible.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </section>
  );
}
