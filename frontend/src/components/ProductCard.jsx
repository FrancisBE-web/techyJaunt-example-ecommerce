import { useRef } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../api";
import { useAddToCart } from "../hooks";
import ProductArt from "./ProductArt";

export default function ProductCard({ product }) {
  const cardRef = useRef(null);
  const addToCart = useAddToCart();
  const soldOut = product.stock < 1;

  // Pointer position drives the tilt and the glare in CSS.
  const track = (event) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--px", ((event.clientX - rect.left) / rect.width).toFixed(3));
    card.style.setProperty("--py", ((event.clientY - rect.top) / rect.height).toFixed(3));
  };

  const reset = () => {
    cardRef.current.style.setProperty("--px", 0.5);
    cardRef.current.style.setProperty("--py", 0.5);
  };

  return (
    <article ref={cardRef} className="card glass" onPointerMove={track} onPointerLeave={reset}>
      <Link to={`/product/${product.id}`} className="card-link">
        <ProductArt product={product} />
        <div className="card-body">
          <p className="eyebrow">{product.category}</p>
          <h3>{product.name}</h3>
          <p className="muted clamp">{product.description}</p>
        </div>
      </Link>
      <div className="card-row">
        <strong className="price">{formatPrice(product.price)}</strong>
        <button
          type="button"
          className="button small"
          onClick={() => addToCart(product)}
          disabled={soldOut}
        >
          {soldOut ? "Sold out" : "Add"}
        </button>
      </div>
    </article>
  );
}
