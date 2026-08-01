import { useState } from "react";

export default function Hero() {
  const [domain, setDomain] = useState("");

  const goToTrustCard = () => {
    if (!domain) return alert("Enter a domain");
    window.location.href = `/trust?domain=${domain}`;
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#f5f1ed] to-[#ece7e1] flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* Floating UI */}
      <div className="absolute inset-0 pointer-events-none">

        <img src="https://randomuser.me/api/portraits/women/44.jpg"
          className="w-16 h-16 rounded-full absolute top-20 left-20 shadow-lg animate-float" />

        <img src="https://randomuser.me/api/portraits/men/32.jpg"
          className="w-20 h-20 rounded-full absolute top-32 right-24 shadow-lg animate-float delay-200" />

        <div className="absolute top-16 right-1/3 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow text-sm animate-float">
          ⭐ 8600 Reviews
        </div>

        <div className="absolute left-1/3 top-40 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow text-sm animate-float delay-300">
          ❤️ 2,580
        </div>

      </div>

      <h1 className="text-5xl md:text-6xl font-semibold text-gray-800 max-w-3xl">
        AI search chooses brands it can{" "}
        <span className="text-indigo-600">trust.</span>
      </h1>

      <p className="mt-6 text-gray-500 max-w-xl">
        Prooft turns your social proof into AI-visible trust.
      </p>

      <div className="mt-10 flex items-center bg-white rounded-full shadow-md p-2 w-full max-w-xl">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="yourcompany.com"
          className="flex-1 px-4 py-2 outline-none rounded-full"
        />

        <button
          onClick={goToTrustCard}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full"
        >
          Check
        </button>
      </div>

    </section>
  );
}
