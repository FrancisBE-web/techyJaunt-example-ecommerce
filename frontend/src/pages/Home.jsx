import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { api } from "../api";
import { CATEGORIES } from "../catalog";
import CardSkeleton from "../components/CardSkeleton";
import LiquidMark from "../components/LiquidMark";
import { sized } from "../components/ProductArt";
import ProductCard from "../components/ProductCard";
import { useReducedMotion } from "../hooks";

gsap.registerPlugin(ScrollTrigger);

const VoyageScene = lazy(() => import("../components/three/VoyageScene"));

function Voyage({ counts, photos }) {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setActive(Math.round(self.progress * (CATEGORIES.length - 1)));
      },
    });

    // Stop rendering the 3D world while it is off screen.
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(section);

    return () => {
      trigger.kill();
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="voyage" aria-label="Browse by category">
      <div className="voyage-stage">
        <Suspense fallback={<div className="voyage-canvas" />}>
          <VoyageScene progressRef={progressRef} active={visible} photos={photos} />
        </Suspense>
        <ol className="voyage-rail mono" aria-hidden="true">
          {CATEGORIES.map((category, index) => (
            <li key={category.id} className={index === active ? "on" : ""}>
              {category.index}
            </li>
          ))}
        </ol>
      </div>

      {CATEGORIES.map((category, index) => (
        <div
          key={category.id}
          id={category.id}
          className={`voyage-step ${index % 2 ? "right" : "left"}`}
        >
          <article
            className={`voyage-card glass ${index === active ? "on" : ""}`}
            style={{ "--accent": category.color }}
          >
            <p className="eyebrow mono">
              {category.index} / {String(CATEGORIES.length).padStart(2, "0")}
            </p>
            <h2>{category.title}</h2>
            <p className="lede">{category.line}</p>
            <div className="voyage-meta">
              <span className="mono">
                {counts[category.id] ?? "–"} {counts[category.id] === 1 ? "piece" : "pieces"}
              </span>
              <Link className="button ghost small" to={`/shop?category=${category.id}`}>
                Enter {category.title.toLowerCase()}
              </Link>
            </div>
          </article>
        </div>
      ))}
    </section>
  );
}

export default function Home() {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/v1/products?limit=50")
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () =>
      products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {}),
    [products],
  );

  // A photo for each stop on the tour: the category's hero product, else any photo in it.
  const photos = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((category) => {
          const inCategory = products.filter(
            (product) => product.category === category.id && product.image?.url,
          );
          const pick = inCategory.find((product) => product.name === category.hero) || inCategory[0];
          const url = pick && (sized(pick.image.url, 1024) || pick.image.url);
          return [category.id, url];
        }),
      ),
    [products],
  );

  // One from each category, then fill to six.
  const featured = useMemo(() => {
    const picks = CATEGORIES.map((category) =>
      products.find((product) => product.category === category.id),
    ).filter(Boolean);
    const rest = products.filter((product) => !picks.includes(product));
    return [...picks, ...rest].slice(0, 6);
  }, [products]);

  const lowest = products.length ? Math.min(...products.map((product) => product.price)) : null;

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }
    const context = gsap.context(() => {
      gsap.from(".hero-line", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.08,
        ease: "expo.out",
      });
      gsap.from(".hero-fade", {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        delay: 0.4,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from(".hero-mark", { scale: 0.7, autoAlpha: 0, duration: 1.6, ease: "expo.out" });
      gsap.to(".hero-mark", {
        yPercent: 25,
        rotate: 8,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }, rootRef);
    return () => context.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || loading) {
      return undefined;
    }
    const context = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%" },
        });
      });
    }, rootRef);
    return () => context.revert();
  }, [reducedMotion, loading]);

  return (
    <div ref={rootRef}>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="chip mono hero-fade">
            <span className="dot" /> Catalog online · {total ?? "—"} pieces
          </p>
          <h1 className="display">
            <span className="line">
              <span className="hero-line">Hardware</span>
            </span>
            <span className="line">
              <span className="hero-line">
                from the <em>near</em>
              </span>
            </span>
            <span className="line">
              <span className="hero-line">future.</span>
            </span>
          </h1>
          <p className="lede hero-fade">
            Phones, computers, sound, play, and the pieces that hold them together. Five
            categories, one cart, nothing extra.
          </p>
          <div className="hero-actions hero-fade">
            <Link className="button" to="/shop">
              Explore the catalog
            </Link>
            <a className="button ghost" href="#phones">
              Take the tour
            </a>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <div className="hero-halo" />
          <LiquidMark size="100%" />
        </div>
        <div className="hero-scroll mono hero-fade" aria-hidden="true">
          <span />
          Scroll
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy}>
              {CATEGORIES.map((category) => (
                <span key={category.id}>
                  {category.title}
                  <i style={{ background: category.color }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <Voyage counts={counts} photos={photos} />

      <section className="section wrap">
        <header className="section-head reveal">
          <div>
            <p className="eyebrow mono">Signals</p>
            <h2 className="title">One from every category.</h2>
          </div>
          <Link className="button ghost" to="/shop">
            View all
          </Link>
        </header>
        {error ? <p className="notice glass">{error}</p> : null}
        <div className="grid">
          {loading ? <CardSkeleton /> : featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="stats wrap reveal">
        <div className="stat glass">
          <span className="mono">Pieces</span>
          <strong>{total ?? "—"}</strong>
        </div>
        <div className="stat glass">
          <span className="mono">Categories</span>
          <strong>{CATEGORIES.length}</strong>
        </div>
        <div className="stat glass">
          <span className="mono">From</span>
          <strong>
            {lowest === null
              ? "—"
              : new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                  maximumFractionDigits: 0,
                }).format(lowest / 100)}
          </strong>
        </div>
      </section>

      <section className="cta wrap reveal">
        <div className="cta-inner glass">
          <p className="eyebrow mono">The edit</p>
          <h2 className="title">Everything you need. Nothing you don&apos;t.</h2>
          <div className="hero-actions">
            <Link className="button" to="/shop">
              Open the catalog
            </Link>
            <Link className="button ghost" to="/signup">
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
