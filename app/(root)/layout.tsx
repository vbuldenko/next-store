import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 p-10">{children}</main>
      <Footer />
    </div>
  );
}
