import Link from "next/link";

const collections = [
  {
    title: "Bagues",
    href: "/shop?category=rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Colliers",
    href: "/shop?category=necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Bracelets",
    href: "/shop?category=bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Packs",
    href: "/packs",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
  },
];

export function CollectionsSection() {
  return (
    <section className="bg-surface py-16">
      <div className="container-shell space-y-8">
        <div className="text-center">
          <h2 className="font-display text-[32px] font-normal text-brand">
            Nos Collections
          </h2>
          <div className="mx-auto mt-4 h-px w-10 bg-gold" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {collections.map((collection) => (
            <Link
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-bg"
              href={collection.href}
              key={collection.title}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-[1.02]"
                style={{
                  backgroundImage: `url(${collection.image})`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand/80 to-transparent px-4 pb-4 pt-16">
                <h3 className="font-display text-2xl font-normal text-surface">
                  {collection.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
