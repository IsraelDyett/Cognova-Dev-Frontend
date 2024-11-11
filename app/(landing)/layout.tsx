import Header from "./_components/header";
import Footer from "./_components/footer";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://app.cognova.io";
  const botID =
    process.env.NODE_ENV == "development"
      ? "bdb97a2d-6645-4821-bd8a-5532b6a1206e"
      : "d9c3a43b-78ae-4d48-a5e4-44baa8e8253b";
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-6 space-y-16 lg:px-8">{children}</main>
      <Footer />
      <script async src={`${origin}/embed.js`} id={botID}></script>
    </div>
  );
};
export default LandingPageLayout;
