export default function Card({ children, ...props }) {
  return <div className="rounded-xl border p-4 shadow" {...props}>{children}</div>;
}