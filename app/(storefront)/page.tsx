import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllCollections, getFeaturedProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { ArrowRight, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Maison — Premium Fashion Boutique",
  description:
    "An editorial fashion boutique offering considered clothing. Ready-to-wear, outerwear, knitwear, and more.",
};

export const revalidate = 3600;

export default async function HomePage() {
  const [collections, featuredProducts] = await Promise.all([
    getAllCollections(),
    getFeaturedProducts(8),
  ]);

  const heroCollection = collections[0];

  return (
    <div style={{ background: "var(--color-background)", overflowX: "hidden" }}>
      {/* ─── 1. ATTENTION (Hero Section) ───────────────────────── */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 700,
          maxHeight: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <Image
            src={
              heroCollection?.cover_image_url ||
              "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=85"
            }
            alt={heroCollection?.name || "Maison Collection"}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.2) 60%, transparent 100%)",
            }}
          />
        </div>

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0 48px",
            width: "100%",
          }}
        >
          <FadeIn direction="up" duration={1000} delay={200}>
            <p
              style={{
                fontSize: "0.80rem",
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(247,245,242,0.85)",
                marginBottom: 20,
              }}
            >
              {new Date().getFullYear()} Exclusive Collection
            </p>
          </FadeIn>
          
          <FadeIn direction="up" duration={1000} delay={400}>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(3.5rem, 8vw, 7rem)",
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#F7F5F2",
                marginBottom: 24,
                maxWidth: "800px",
              }}
            >
              Redefining <br/> Modern Elegance.
            </h1>
          </FadeIn>

          <FadeIn direction="up" duration={1000} delay={600}>
            <p
              style={{
                color: "rgba(247,245,242,0.8)",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "1.2rem",
                maxWidth: 480,
                lineHeight: 1.6,
                marginBottom: 40,
              }}
            >
              {heroCollection?.description || "Discover a curated selection of refined pieces that balance timeless aesthetics with contemporary comfort."}
            </p>
          </FadeIn>
          
          <FadeIn direction="up" duration={1000} delay={800}>
            <Link
              href={
                heroCollection
                  ? `/collections/${heroCollection.slug}`
                  : "/collections"
              }
              className="btn-ghost"
              style={{ 
                color: "#F7F5F2", 
                borderColor: "rgba(247,245,242,0.6)",
                padding: "16px 32px",
                fontSize: "0.9rem"
              }}
            >
              Explore the Collection
              <ArrowRight size={16} strokeWidth={1.5} style={{ marginLeft: 8 }} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ─── ATTENTION (Transition Marquee) ─── */}
      <div style={{ padding: "16px 0", background: "var(--color-text)", color: "var(--color-white)", overflow: "hidden", whiteSpace: "nowrap", borderTop: "1px solid var(--color-text)" }}>
        <div className="marquee-content" style={{ display: "inline-block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.9 }}>
          <span style={{ margin: "0 48px" }}>Free Shipping on Orders Over $300</span>
          <span style={{ margin: "0 48px" }}>•</span>
          <span style={{ margin: "0 48px" }}>Handcrafted in Europe</span>
          <span style={{ margin: "0 48px" }}>•</span>
          <span style={{ margin: "0 48px" }}>Sustainable Materials</span>
          <span style={{ margin: "0 48px" }}>•</span>
          <span style={{ margin: "0 48px" }}>Complimentary Returns</span>
          {/* Duplicate for infinite effect */}
          <span style={{ margin: "0 48px" }}>Free Shipping on Orders Over $300</span>
          <span style={{ margin: "0 48px" }}>•</span>
          <span style={{ margin: "0 48px" }}>Handcrafted in Europe</span>
          <span style={{ margin: "0 48px" }}>•</span>
          <span style={{ margin: "0 48px" }}>Sustainable Materials</span>
          <span style={{ margin: "0 48px" }}>•</span>
          <span style={{ margin: "0 48px" }}>Complimentary Returns</span>
        </div>
      </div>

      {/* ─── 2. INTEREST (Collections & Story) ─────────────────── */}
      <section className="section" style={{ padding: "140px 0 100px" }}>
        <div className="container">
          <FadeIn direction="up">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginBottom: 100,
                maxWidth: 680,
                margin: "0 auto 100px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 300,
                  marginBottom: 24,
                  lineHeight: 1.1,
                }}
              >
                Curated Aesthetics
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: "500px" }}>
                Browse our seasonal narratives. Every collection is carefully 
                designed to tell a story through premium fabrics and meticulous tailoring.
              </p>
            </div>
          </FadeIn>

          <div className="editorial-grid">
            {collections.map((col, idx) => {
              return (
                <FadeIn 
                  key={col.id} 
                  direction="up" 
                  delay={idx * 100} 
                  className={`editorial-item editorial-item-${idx}`}
                >
                  <Link
                    href={`/collections/${col.slug}`}
                    style={{
                      display: "block",
                      position: "relative",
                      aspectRatio: "4/5",
                      overflow: "hidden",
                      background: "var(--color-border)",
                      borderRadius: "2px",
                    }}
                    className="collection-card-wrapper"
                  >
                    {col.cover_image_url && (
                      <Image
                        src={col.cover_image_url}
                        alt={col.name}
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        style={{
                          objectFit: "cover",
                          transition: "transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)",
                        }}
                        className="collection-img"
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0) 100%)",
                        transition: "opacity 500ms ease",
                      }}
                      className="collection-scrim"
                    />
                    
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "48px 32px 32px",
                        transform: "translateY(16px)",
                        transition: "transform 500ms cubic-bezier(0.165, 0.84, 0.44, 1), opacity 500ms ease",
                      }}
                      className="collection-text"
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.75rem",
                          letterSpacing: "0.25em",
                          color: "rgba(247,245,242,0.6)",
                          textTransform: "uppercase",
                          marginBottom: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <span style={{ width: "20px", height: "1px", background: "rgba(247,245,242,0.6)", display: "inline-block" }}></span>
                        Chapter {String(idx + 1).padStart(2, '0')}
                      </p>
                      
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "clamp(2rem, 3vw, 2.5rem)",
                          fontWeight: 300,
                          color: "#F7F5F2",
                          marginBottom: "16px",
                          lineHeight: 1.1,
                        }}
                      >
                        {col.name}
                      </h3>
                      
                      <div 
                        className="collection-link-group"
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between",
                          borderTop: "1px solid rgba(247,245,242,0.2)",
                          paddingTop: "16px",
                          marginTop: "8px"
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.75rem",
                            letterSpacing: "0.15em",
                            color: "rgba(247,245,242,0.5)",
                            textTransform: "uppercase",
                          }}
                        >
                          {(col as any).product_count || 0} Pieces
                        </p>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span 
                            className="explore-text"
                            style={{ 
                              fontSize: "0.75rem", 
                              textTransform: "uppercase", 
                              letterSpacing: "0.15em", 
                              color: "#F7F5F2",
                              opacity: 0
                            }}
                          >
                            Explore
                          </span>
                          <ArrowRight size={18} color="#F7F5F2" className="collection-arrow" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Split Story Section ─── */}
      <section style={{ backgroundColor: "var(--color-white)", padding: "0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <div style={{ position: "relative", minHeight: "50vh", overflow: "hidden" }}>
             <Image 
               src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=80"
               alt="Craftsmanship"
               fill
               style={{ objectFit: "cover" }}
             />
          </div>
          <div style={{ padding: "clamp(48px, 8vw, 100px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <FadeIn direction="left">
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-muted)", marginBottom: "16px", display: "block" }}>Our Philosophy</span>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", fontWeight: 300, lineHeight: 1.2, marginBottom: "24px" }}>
                Uncompromising <br/> Quality.
              </h3>
              <p style={{ color: "var(--color-muted)", lineHeight: 1.8, marginBottom: "32px", fontSize: "1.05rem" }}>
                We believe in clothing that outlasts fleeting trends. Every seam, every stitch, and every fabric choice is meticulously vetted to ensure it meets our standard of slow, intentional fashion.
              </p>
              <Link href="/about" className="btn-solid" style={{ alignSelf: "flex-start", padding: "12px 28px", borderRadius: "2px" }}>
                Discover Our Story
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Materials Breakdown (INTEREST) ─── */}
      <section className="section" style={{ backgroundColor: "#F7F5F2", padding: "100px 0", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <FadeIn direction="up">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, textAlign: "center", marginBottom: "60px" }}>
              The Foundation of Our Craft
            </h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "48px", textAlign: "center" }}>
            <FadeIn direction="up" delay={100}>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Organic Cotton</h4>
              <p style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>Sourced from regenerative farms, ensuring a lower carbon footprint and unparalleled softness.</p>
            </FadeIn>
            <FadeIn direction="up" delay={200}>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Recycled Cashmere</h4>
              <p style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>Repurposed from post-consumer garments, offering the same luxury without the environmental cost.</p>
            </FadeIn>
            <FadeIn direction="up" delay={300}>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Vegetable-Tanned Leather</h4>
              <p style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>Treated using natural tannins found in barks and leaves, aging beautifully over time.</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── 3. DESIRE (Exclusive Offers & Featured Products) ─── */}
      <section style={{ backgroundColor: "#1A1A1A", color: "#F7F5F2", padding: "80px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <FadeIn direction="right">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Tag size={32} strokeWidth={1} />
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 400 }}>Seasonal Archive Sale</h3>
                <p style={{ fontSize: "0.9rem", opacity: 0.7, marginTop: 4 }}>Up to 40% off selected past season items.</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn direction="left" delay={200}>
            <Link href="/collections" className="btn-ghost" style={{ borderColor: "rgba(247,245,242,0.4)", color: "#F7F5F2" }}>
              Shop the Archive
            </Link>
          </FadeIn>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="section" style={{ paddingTop: 100, paddingBottom: 100 }}>
          <div className="container">
            <FadeIn direction="up">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: 60,
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: 24,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                    fontWeight: 400,
                  }}
                >
                  Most Desired
                </h2>
                <Link
                  href="/products"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--color-text)",
                  }}
                  className="hover-underline"
                >
                  Browse All Products
                </Link>
              </div>
            </FadeIn>

            <div className="scroll-x" style={{ paddingBottom: 32, margin: "0 -24px", paddingLeft: 24, paddingRight: 24 }}>
              {featuredProducts.map((product, idx) => (
                <FadeIn key={product.id} direction="up" delay={100 + idx * 100}>
                  <div style={{ width: "clamp(280px, 25vw, 360px)" }}>
                    <ProductCard product={product} />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Pull quote ─────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "var(--color-white)",
        }}
      >
        <FadeIn direction="up">
          <blockquote className="pull-quote" style={{ maxWidth: 900, fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1 }}>
            "Clothing as considered as the life it accompanies."
          </blockquote>
        </FadeIn>
      </section>

      {/* ─── Voices of Maison (DESIRE) ─── */}
      <section style={{ padding: "100px 0", background: "var(--color-background)", borderTop: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div className="container" style={{ marginBottom: "60px" }}>
          <FadeIn direction="up">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, textAlign: "center" }}>Voices of Maison</h2>
          </FadeIn>
        </div>
        <div className="testimonial-scroller" style={{ display: "flex", overflow: "hidden" }}>
          <div className="testimonial-scroll-track" style={{ display: "flex", gap: "24px", paddingRight: "24px" }}>
            {[
              {
                quote: "The overcoat I purchased has become my daily uniform. The drape and the weight of the fabric are absolutely impeccable. Truly a lifetime piece.",
                name: "Aarti M.",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
              },
              {
                quote: "In an era of fast fashion, Maison offers a sanctuary of genuine quality. I can feel the difference in how the garments breathe and move with me.",
                name: "Rohan D.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
              },
              {
                quote: "The attention to detail in the stitching and the luxurious feel of the organic cotton are unmatched. I've completely elevated my core wardrobe.",
                name: "Kavya P.",
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80"
              },
              {
                quote: "From the unboxing experience to the very first wear, everything exudes perfection and slow luxury. The cashmere is incredibly soft.",
                name: "Vikram S.",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: "inline-flex",
                  flexDirection: "column",
                  width: "clamp(300px, 80vw, 400px)", 
                  padding: "40px", 
                  border: "1px solid var(--color-border)",
                  whiteSpace: "normal",
                  flexShrink: 0,
                  background: "var(--color-white)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ position: "relative", width: "48px", height: "48px", overflow: "hidden", borderRadius: "50%" }}>
                    <Image src={item.image} alt={item.name} fill sizes="48px" style={{ objectFit: "cover" }} />
                  </div>
                  <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>— {item.name}</span>
                </div>
                <p style={{ fontSize: "1.05rem", fontStyle: "italic", color: "var(--color-text)", lineHeight: 1.7 }}>
                  "{item.quote}"
                </p>
              </div>
            ))}
          </div>
          <div className="testimonial-scroll-track" aria-hidden="true" style={{ display: "flex", gap: "24px", paddingRight: "24px" }}>
            {[
              {
                quote: "The overcoat I purchased has become my daily uniform. The drape and the weight of the fabric are absolutely impeccable. Truly a lifetime piece.",
                name: "Aarti M.",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
              },
              {
                quote: "In an era of fast fashion, Maison offers a sanctuary of genuine quality. I can feel the difference in how the garments breathe and move with me.",
                name: "Rohan D.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
              },
              {
                quote: "The attention to detail in the stitching and the luxurious feel of the organic cotton are unmatched. I've completely elevated my core wardrobe.",
                name: "Kavya P.",
                image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80"
              },
              {
                quote: "From the unboxing experience to the very first wear, everything exudes perfection and slow luxury. The cashmere is incredibly soft.",
                name: "Vikram S.",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"
              }
            ].map((item, idx) => (
              <div 
                key={idx + 4} 
                style={{ 
                  display: "inline-flex",
                  flexDirection: "column",
                  width: "clamp(300px, 80vw, 400px)", 
                  padding: "40px", 
                  border: "1px solid var(--color-border)",
                  whiteSpace: "normal",
                  flexShrink: 0,
                  background: "var(--color-white)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ position: "relative", width: "48px", height: "48px", overflow: "hidden", borderRadius: "50%" }}>
                    <Image src={item.image} alt={item.name} fill sizes="48px" style={{ objectFit: "cover" }} />
                  </div>
                  <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>— {item.name}</span>
                </div>
                <p style={{ fontSize: "1.05rem", fontStyle: "italic", color: "var(--color-text)", lineHeight: 1.7 }}>
                  "{item.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Visit the Boutique (ACTION) ─── */}
      <section style={{ backgroundColor: "#1A1A1A", color: "#F7F5F2", padding: "120px 0" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <FadeIn direction="up">
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.6, marginBottom: "24px", display: "inline-block" }}>Experience It In Person</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, marginBottom: "32px" }}>Our Flagship Boutique</h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, maxWidth: "550px", opacity: 0.8, marginBottom: "48px", margin: "0 auto 48px" }}>
              Located in the heart of the city, our space is designed to complement the tranquility of our collections. Book a private fitting or stop by to feel the textiles.
            </p>
            <Link href="/locations" className="btn-ghost" style={{ borderColor: "rgba(247,245,242,0.4)", color: "#F7F5F2", padding: "16px 40px", fontSize: "0.9rem" }}>
              View Store Details
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ─── 4. ACTION (Newsletter & Footer prep) ─────────────── */}
      <section
        style={{
          padding: "120px 24px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, pointerEvents: "none" }}>
            <Image 
               src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1600&q=80"
               alt="Texture"
               fill
               style={{ objectFit: "cover" }}
             />
        </div>
        
        <FadeIn direction="up">
          <div style={{ maxWidth: 500, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: "32px" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: 16, display: "inline-block" }}>
                Join the Inner Circle
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "3rem",
                  fontWeight: 300,
                  marginBottom: 16,
                  color: "var(--color-text)",
                }}
              >
                In the Season
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "var(--color-muted)",
                  marginBottom: 40,
                }}
              >
                Sign up for early access to new arrivals, exclusive editorials, and archival sales. Delivered selectively.
              </p>
            </div>
            
            <form
              action="#"
              style={{ display: "flex", gap: 0, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                style={{
                  flex: 1,
                  padding: "18px 24px",
                  border: "1px solid var(--color-border)",
                  borderRight: "none",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.95rem",
                  background: "var(--color-white)",
                  outline: "none",
                  borderRadius: "4px 0 0 4px",
                }}
              />
              <button
                type="button"
                className="btn-solid"
                style={{ borderRadius: "0 4px 4px 0", padding: "18px 32px", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em" }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </FadeIn>
      </section>

      {/* Global styles for hover effects in collections */}
      <style>{`
        .editorial-grid {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        @media (min-width: 900px) {
          .editorial-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
            align-items: stretch;
          }
        }

        .collection-card-wrapper:hover .collection-img { 
          transform: scale(1.08); 
        }
        .collection-card-wrapper .collection-text {
          transform: translateY(24px);
          opacity: 0.9;
        }
        .collection-card-wrapper:hover .collection-text {
          transform: translateY(0px);
          opacity: 1;
        }
        
        .collection-card-wrapper .explore-text {
          opacity: 0;
          transform: translateX(-10px);
          transition: all 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .collection-card-wrapper:hover .explore-text {
          opacity: 1;
          transform: translateX(0);
        }

        .collection-card-wrapper .collection-arrow {
          transform: translateX(-20px);
          transition: transform 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .collection-card-wrapper:hover .collection-arrow {
          transform: translateX(0);
        }

        .hover-underline {
          position: relative;
        }
        .hover-underline::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: currentColor;
          transform-origin: bottom right;
          transition: transform 0.25s ease-out;
        }
        .hover-underline:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-content {
          animation: marquee 20s linear infinite;
        }

        @keyframes scroll-left-testimonials {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .testimonial-scroll-track {
          flex-shrink: 0;
          animation: scroll-left-testimonials 35s linear infinite;
        }
        .testimonial-scroller:hover .testimonial-scroll-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

