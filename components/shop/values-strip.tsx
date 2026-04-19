const values = [
  "Modern Design",
  "Durable Materials",
  "Ships Across Morocco",
];

export function ValuesStrip() {
  return (
    <section className="border-y border-border bg-panel/60">
      <div className="container-shell grid gap-4 py-5 text-center sm:grid-cols-3">
        {values.map((value) => (
          <p
            className="text-sm uppercase tracking-[0.28em] text-gold"
            key={value}
          >
            {value}
          </p>
        ))}
      </div>
    </section>
  );
}
