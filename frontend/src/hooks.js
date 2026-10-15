import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken } from "./auth";
import { useApp } from "./store";

export function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useAddToCart() {
  const { addToCart, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    async (product, quantity = 1) => {
      if (!getToken()) {
        navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
        return;
      }
      try {
        await addToCart(product.id, quantity);
        toast(`${product.name} added to cart`, "success");
      } catch (error) {
        toast(error.message, "error");
      }
    },
    [addToCart, toast, navigate, location],
  );
}
