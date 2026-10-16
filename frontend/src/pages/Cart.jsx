import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../api";
import ProductArt from "../components/ProductArt";
import { useApp } from "../store";

export default function Cart() {
  const { user, cart, cartCount, updateCartItem, removeCartItem, toast } = useApp();
  const [busy, setBusy] = useState("");

  if (!user) {
    return (
      <section className="panel glass page">
        <p className="eyebrow mono">Cart</p>
        <h1 className="title">Sign in to keep a cart.</h1>
        <p className="muted">Your cart is saved to your account, so it follows you.</p>
        <div className="hero-actions">
          <Link className="button" to="/login?next=/cart">
            Sign in
          </Link>
          <Link className="button ghost" to="/signup">
            Create an account
          </Link>
        </div>
      </section>
    );
  }

  const run = async (productId, action) => {
    setBusy(productId);
    try {
      await action();
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy("");
    }
  };

  const items = cart.items || [];
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <section className="panel glass page">
        <p className="eyebrow mono">Cart</p>
        <h1 className="title">Nothing here yet.</h1>
        <p className="muted">Pick something from the catalog and it will wait for you here.</p>
        <Link className="button" to="/shop">
          Open the catalog
        </Link>
      </section>
    );
  }

  return (
    <section className="section page wrap">
      <header className="shop-head">
        <div>
          <p className="eyebrow mono">Cart</p>
          <h1 className="title">Your selection</h1>
        </div>
        <p className="mono muted">
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </p>
      </header>

      <div className="cart">
        <ul className="cart-list">
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className={`cart-item glass ${busy === product.id ? "busy" : ""}`}
            >
              <Link to={`/product/${product.id}`} className="cart-thumb">
                <ProductArt product={product} sizes="120px" />
              </Link>
              <div className="cart-detail">
                <p className="eyebrow mono">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>
                <p className="muted mono">{formatPrice(product.price)} each</p>
              </div>
              <div className="stepper glass">
                <button
                  type="button"
                  aria-label={`Decrease ${product.name}`}
                  disabled={quantity <= 1 || busy === product.id}
                  onClick={() => run(product.id, () => updateCartItem(product.id, quantity - 1))}
                >
                  −
                </button>
                <span className="mono">{quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${product.name}`}
                  disabled={quantity >= product.stock || busy === product.id}
                  onClick={() => run(product.id, () => updateCartItem(product.id, quantity + 1))}
                >
                  +
                </button>
              </div>
              <strong className="price">{formatPrice(product.price * quantity)}</strong>
              <button
                type="button"
                className="remove"
                aria-label={`Remove ${product.name}`}
                disabled={busy === product.id}
                onClick={() => run(product.id, () => removeCartItem(product.id))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary glass">
          <h2>Summary</h2>
          <dl>
            <div>
              <dt>Items</dt>
              <dd className="mono">{cartCount}</dd>
            </div>
            <div>
              <dt>Subtotal</dt>
              <dd className="mono">{formatPrice(total)}</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <button type="button" className="button grow" disabled>
            Checkout coming soon
          </button>
          <Link className="button ghost grow" to="/shop">
            Keep browsing
          </Link>
        </aside>
      </div>
    </section>
  );
}
