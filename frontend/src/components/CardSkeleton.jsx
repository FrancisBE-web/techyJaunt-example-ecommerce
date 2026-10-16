export default function CardSkeleton({ count = 6 }) {
  return Array.from({ length: count }, (_, index) => (
    <div key={index} className="card glass skeleton" aria-hidden="true">
      <div className="skeleton-art" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  ));
}
