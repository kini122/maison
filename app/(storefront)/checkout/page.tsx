"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useCartStore } from "@/store/cart";
import { formatPrice, buildWhatsAppMessage } from "@/lib/utils";
import { MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.email("Enter a valid email"),
  countryCode: z.string().min(1),
  phone: z.string().min(7, "Enter a valid phone number"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().min(4, "PIN code is required"),
  deliveryNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapShown, setMapShown] = useState(false);
  const [pinLocation, setPinLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);
  const address1Ref = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema) as any,
    defaultValues: { countryCode: "+91" },
  });

  // Load Google Maps
  const loadGoogleMaps = useCallback(() => {
    if (window.google) {
      initMap();
      return;
    }
    window.initGoogleMaps = () => {
      initMap();
    };
    const script = document.createElement("script");
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    document.head.appendChild(script);
  }, []); // eslint-disable-line

  const initMap = useCallback(() => {
    if (!mapRef.current) return;
    setMapLoaded(true);

    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India center

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 5,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#F7F5F2" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#F7F5F2" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#1a1a1a" }] },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#E8E4DF" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#C8BEB2" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    const marker = new window.google.maps.Marker({
      position: defaultCenter,
      map,
      draggable: true,
      title: "Drag to your exact location",
    });

    markerRef.current = marker;

    marker.addListener("dragend", async () => {
      const pos = marker.getPosition();
      const lat = pos.lat();
      const lng = pos.lng();
      setPinLocation({ lat, lng });

      // Reverse geocoding
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
        if (status === "OK" && results[0]) {
          const components = results[0].address_components;
          const getComp = (type: string) =>
            components.find((c: any) => c.types.includes(type))?.long_name || "";

          setValue("addressLine1", results[0].formatted_address.split(",")[0]);
          setValue("city", getComp("locality") || getComp("sublocality_level_1"));
          setValue("state", getComp("administrative_area_level_1"));
          setValue("pinCode", getComp("postal_code"));
        }
      });
    });

    // Places Autocomplete on address field
    if (address1Ref.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        address1Ref.current,
        { componentRestrictions: { country: "in" } }
      );
      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        map.setCenter({ lat, lng });
        map.setZoom(16);
        marker.setPosition({ lat, lng });
        setPinLocation({ lat, lng });

        const components = place.address_components || [];
        const getComp = (type: string) =>
          components.find((c: any) => c.types.includes(type))?.long_name || "";

        setValue("city", getComp("locality") || getComp("sublocality_level_1"));
        setValue("state", getComp("administrative_area_level_1"));
        setValue("pinCode", getComp("postal_code"));
      });
    }
  }, []); // eslint-disable-line

  const handleShowMap = () => {
    setMapShown(true);
    setTimeout(() => loadGoogleMaps(), 100);
  };

  const onSubmit = (data: CheckoutFormData) => {
    const message = buildWhatsAppMessage({
      fullName: data.fullName,
      phone: `${data.countryCode}${data.phone}`,
      email: data.email,
      items: items.map((i) => ({
        name: i.productName,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      lat: pinLocation?.lat,
      lng: pinLocation?.lng,
      notes: data.deliveryNotes,
    });

    const waNumber = "919745441542";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 24,
          textAlign: "center",
          padding: 24,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "2rem",
            fontWeight: 400,
          }}
        >
          Nothing to check out.
        </h1>
        <Link href="/collections" className="btn-ghost">
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2.5rem",
          fontWeight: 400,
          marginBottom: 48,
        }}
      >
        Checkout
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 64,
          alignItems: "start",
        }}
        className="checkout-layout"
      >
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit as any)} noValidate>
          {/* Personal details */}
          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 24,
                paddingBottom: 12,
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              Customer Details
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
              className="form-grid"
            >
              {/* Full Name */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="field-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  className={`field-input ${errors.fullName ? "error" : ""}`}
                  placeholder="Arjun Kapoor"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="field-error">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="field-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`field-input ${errors.email ? "error" : ""}`}
                  placeholder="arjun@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="field-error">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="field-label" htmlFor="phone">
                  Phone Number
                </label>
                <div style={{ display: "flex" }}>
                  <div style={{ position: "relative" }}>
                    <select
                      {...register("countryCode")}
                      style={{
                        appearance: "none",
                        padding: "12px 28px 12px 12px",
                        border: "1px solid var(--color-border)",
                        borderRight: "none",
                        background: "var(--color-bg)",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      {["+91", "+1", "+44", "+971", "+65", "+61"].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      style={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    className={`field-input ${errors.phone ? "error" : ""}`}
                    placeholder="9876543210"
                    style={{ flex: 1 }}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="field-error">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Address */}
          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 24,
                paddingBottom: 12,
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              Delivery Address
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
              className="form-grid"
            >
              {/* Address line 1 */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="field-label" htmlFor="addressLine1">
                  Address Line 1
                </label>
                <input
                  id="addressLine1"
                  className={`field-input ${errors.addressLine1 ? "error" : ""}`}
                  placeholder="House/Flat no, Street, Area"
                  {...register("addressLine1")}
                  ref={(e) => {
                    register("addressLine1").ref(e);
                    address1Ref.current = e;
                  }}
                />
                {errors.addressLine1 && (
                  <p className="field-error">{errors.addressLine1.message}</p>
                )}
              </div>

              {/* Address line 2 */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="field-label" htmlFor="addressLine2">
                  Address Line 2{" "}
                  <span style={{ color: "var(--color-muted)" }}>(optional)</span>
                </label>
                <input
                  id="addressLine2"
                  className="field-input"
                  placeholder="Landmark, Apartment name"
                  {...register("addressLine2")}
                />
              </div>

              {/* City */}
              <div>
                <label className="field-label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  className={`field-input ${errors.city ? "error" : ""}`}
                  placeholder="Mumbai"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="field-error">{errors.city.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="field-label" htmlFor="state">
                  State / District
                </label>
                <input
                  id="state"
                  className={`field-input ${errors.state ? "error" : ""}`}
                  placeholder="Maharashtra"
                  {...register("state")}
                />
                {errors.state && (
                  <p className="field-error">{errors.state.message}</p>
                )}
              </div>

              {/* PIN code */}
              <div>
                <label className="field-label" htmlFor="pinCode">
                  PIN Code
                </label>
                <input
                  id="pinCode"
                  className={`field-input ${errors.pinCode ? "error" : ""}`}
                  placeholder="400001"
                  {...register("pinCode")}
                />
                {errors.pinCode && (
                  <p className="field-error">{errors.pinCode.message}</p>
                )}
              </div>

              {/* Delivery notes */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="field-label" htmlFor="deliveryNotes">
                  Delivery Notes{" "}
                  <span style={{ color: "var(--color-muted)" }}>(optional)</span>
                </label>
                <textarea
                  id="deliveryNotes"
                  className="field-input"
                  placeholder="Leave at gate / Call on arrival / etc."
                  rows={3}
                  style={{ resize: "vertical" }}
                  {...register("deliveryNotes")}
                />
              </div>
            </div>
          </section>

          {/* Google Maps */}
          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              Pin Your Location
            </h2>

            {!mapShown ? (
              <button
                type="button"
                onClick={handleShowMap}
                className="btn-ghost"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <MapPin size={14} strokeWidth={1.5} />
                Use Map to Pin Location
              </button>
            ) : (
              <div>
                <div
                  ref={mapRef}
                  style={{
                    width: "100%",
                    height: 320,
                    background: "var(--color-border)",
                    marginBottom: 8,
                  }}
                />
                {pinLocation && (
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--color-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <MapPin size={12} strokeWidth={1.5} />
                    Pin set at {pinLocation.lat.toFixed(5)},{" "}
                    {pinLocation.lng.toFixed(5)}
                  </p>
                )}
                {!mapLoaded && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-muted)",
                    }}
                  >
                    Loading map…
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Submit */}
          <button
            type="submit"
            className="btn-solid"
            style={{ width: "100%", padding: "16px 24px", fontSize: "0.8rem" }}
          >
            Proceed via WhatsApp
          </button>
          <p
            style={{
              fontSize: "0.72rem",
              color: "var(--color-muted)",
              textAlign: "center",
              marginTop: 12,
            }}
          >
            You&apos;ll be redirected to WhatsApp to confirm your order.
          </p>
        </form>

        {/* Order Summary — sticky */}
        <div
          style={{
            position: "sticky",
            top: 88,
            background: "var(--color-white)",
            border: "1px solid var(--color-border)",
            padding: 28,
          }}
          className="order-summary"
        >
          {/* Mobile toggle */}
          <button
            className="show-mobile-flex"
            onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
            style={{
              display: "none",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Order Summary ({items.length} items)
            </span>
            <ChevronDown
              size={14}
              style={{
                transform: orderSummaryOpen ? "rotate(180deg)" : "none",
                transition: "transform 200ms",
              }}
            />
          </button>

          <div className="summary-content">
            <h2
              className="hide-mobile"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.25rem",
                fontWeight: 400,
                marginBottom: 20,
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  style={{ display: "flex", gap: 12, alignItems: "center" }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 64,
                      position: "relative",
                      background: "var(--color-border)",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.875rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.productName}
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--color-muted)",
                        marginTop: 2,
                      }}
                    >
                      Size {item.size} × {item.quantity}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.875rem",
                      flexShrink: 0,
                    }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="divider" style={{ margin: "16px 0" }} />

            <div
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.9rem",
                  }}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}
                >
                  Shipping
                </span>
                <span
                  style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}
                >
                  TBD
                </span>
              </div>
            </div>

            <div className="divider" style={{ margin: "16px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.15rem",
                  fontWeight: 400,
                }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-layout { grid-template-columns: 1fr !important; gap: 32px !important; }
          .order-summary { position: static !important; order: -1; }
          .show-mobile-flex { display: flex !important; }
          .hide-mobile { display: none !important; }
          .summary-content { display: none; }
          .summary-content.open { display: block; }
        }
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .form-grid > * { grid-column: 1 !important; }
        }
      `}</style>
    </div>
  );
}
