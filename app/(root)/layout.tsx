import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import HeaderCategorySelector from "@/components/shared/Header/CategorySelector";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header categorySelector={<HeaderCategorySelector />} />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
