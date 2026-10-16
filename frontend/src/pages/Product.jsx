import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatPrice } from "../api";
import { categoryById } from "../catalog";
import ProductArt from "../components/ProductArt";
import ProductCard from "../components/ProductCard";
import { useAddToCart, useReducedMotion } from "../hooks";

const ProductStage = lazy(() => import("../components/three/ProductStage"));

export default function Product() {
  const { id } = useParams();
  const addToCart = useAddToCart();
  const reducedMotion = useReducedMotion();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [view, setView] = useState("photo");

  useEffect(() => {
    setProduct(null);
    setRelated([]);
    setError("");
    setQuantity(1);
    setView("photo");
    api(`/api/v1/products/${id}`)
      .then((data) => {
        setProduct(data.product);
        return api(`/api/v1/products?limit=4&category=${data.product.category}`);
      })
      .then((data) =>
        setRelated((data.products || []).filter((item) => item.id !== id).slice(0, 3)),
      )
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <section className="panel glass page">
        <h1 className="title">Not found</h1>
        <p className="muted">{error}</p>
        <Link className="button" to="/shop">
          Back to the catalog
        </Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product wrap page">
        <div className="product-stage glass skeleton" />
        <div className="product-info">
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      </section>
    );
  }

  const category = categoryById(product.category);
  const soldOut = product.stock < 1;
  const low = !soldOut && product.stock <= 5;
  const stockLabel = soldOut ? "Sold out" : low ? `Only ${product.stock} left` : "In stock";

  return (
    <>
      <section className="product wrap page">
        <div className="product-stage glass" style={{ "--accent": category.color }}>
          {product.image?.url && view === "photo" ? (
            <ProductArt product={product} sizes="(max-width: 960px) 100vw, 640px" eager />
          ) : (
            <>
              <Suspense fallback={<div className="stage-loading loader" />}>
                <ProductStage
                  category={product.category}
                  color={category.color}
                  reducedMotion={reducedMotion}
                />
              </Suspense>
              <p className="stage-hint mono">Drag to rotate</p>
            </>
          )}
          {product.image?.url ? (
            <div className="view-toggle glass" role="group" aria-label="View">
              {["photo", "3d"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={view === mode ? "on" : ""}
                  aria-pressed={view === mode}
                  onClick={() => setView(mode)}
                >
                  {mode === "photo" ? "Photo" : "3D"}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-info">
          <nav className="crumbs mono" aria-label="Breadcrumb">
            <Link to="/shop">Catalog</Link>
            <span>/</span>
            <Link to={`/shop?category=${category.id}`}>{category.title}</Link>
          </nav>
          <h1 className="title">{product.name}</h1>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="lede">{product.description}</p>

          <p className={`stock mono ${soldOut ? "out" : low ? "low" : ""}`}>
            <span className="dot" />
            {stockLabel}
          </p>

          <div className="buy">
            <div className="stepper glass">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={soldOut || quantity <= 1}
              >
                −
              </button>
              <span className="mono">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
                disabled={soldOut || quantity >= product.stock}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="button grow"
              disabled={soldOut}
              onClick={() => addToCart(product, quantity)}
            >
              {soldOut ? "Sold out" : `Add to cart · ${formatPrice(product.price * quantity)}`}
            </button>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section wrap">
          <header className="section-head">
            <div>
              <p className="eyebrow mono">Nearby</p>
              <h2 className="title">More in {category.title.toLowerCase()}</h2>
            </div>
          </header>
          <div className="grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
