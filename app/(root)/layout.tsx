import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import HeaderCategorySelector from "@/components/layout/header/CategorySelector";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header categorySelector={<HeaderCategorySelector />} />
      <main className="flex-1 p-10">{children}</main>
      <Footer />
    </div>
  );
}
