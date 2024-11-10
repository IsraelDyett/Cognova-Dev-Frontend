"use client";

export default function Home() {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://app.cognova.io";
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      Hello World!
      <script async src={`${origin}/embed.js`} id="d9c3a43b-78ae-4d48-a5e4-44baa8e8253b"></script>
    </section>
  );
}
