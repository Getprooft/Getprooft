import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Sidebar from "./components/Sidebar";
import ScoreCircle from "./components/ScoreCircle";

export default function App() {
  const [page, setPage] = useState("home");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    const path = window.location.pathname;

    if (path.includes("trust")) {
      setPage("trust");

      const params = new URLSearchParams(window.location.search);
      setDomain(params.get("domain") || "");
    }
  }, []);

  if (page === "trust") {
    return (
      <div className="min-h-screen bg-[#f5f1ed] p-10">
        <Sidebar />

        <h1 className="text-3xl font-semibold mb-2">Trust Card</h1>
        <p className="text-gray-500 mb-8">{domain}</p>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="mb-4">AI Trust Score</h2>
            <ScoreCircle score={82} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2>AI Visibility</h2>
            <p className="text-green-600">High</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2>Signals</h2>
            <ul>
              <li>✅ Reviews</li>
              <li>✅ Social</li>
              <li>✅ Secure</li>
            </ul>
          </div>

        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <Hero />
    </>
  );
}
