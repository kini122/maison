import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: "100vh" }}>{children}</main>
      <Footer />
    </Providers>
  );
}
