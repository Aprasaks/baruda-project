// src/app/page.tsx

"use client";

import { useState, useEffect } from "react";
import KnowledgeGraphBackground from "@/components/KnowledgeGraphBackground";
import Header from "@/components/Header";

interface SearchResult {
  answer: string;
  sources: string[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [highlightNodes, setHighlightNodes] = useState<string[]>([]);
  const [dataNodes, setDataNodes] = useState<string[]>([]);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await fetch("http://localhost:8000/graph-data");
        const data = await res.json();
        if (data.nodes && data.nodes.length > 0) {
          setDataNodes(data.nodes);
        } else {
          throw new Error("No nodes found");
        }
      } catch (err) {
        // [수정 1] err를 사용하지 않아서 뜬 경고 해결 -> 콘솔에 출력
        console.error("백엔드 연결 실패:", err);

        setDataNodes([
          "Product_Discovery",
          "Strategy_Roadmap",
          "Prioritization",
          "UX_Design",
          "Agile_Execution",
          "Data_Analytics",
          "Stakeholder_Mgmt",
        ]);
      }
    };
    fetchNodes();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setHighlightNodes([]);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const randomSources = dataNodes.sort(() => 0.5 - Math.random()).slice(0, 2);

    const fakeResponse: SearchResult = {
      // [수정 2] 텍스트 내 따옴표(') 처리 -> Baruda's
      answer: `"${query}"에 대한 통찰입니다. PM 커리큘럼에 따르면 이 단계에서는 데이터에 기반한 의사결정과 사용자 중심의 사고가 핵심입니다.`,
      sources: randomSources,
    };

    setResult(fakeResponse);
    setHighlightNodes(randomSources);
    setIsLoading(false);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-end overflow-hidden p-6 pb-20">
      <KnowledgeGraphBackground
        highlightNodes={highlightNodes}
        dataNodes={dataNodes}
      />

      <Header />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center transition-all duration-500">
        {/* [수정 3] Tailwind v4 문법 적용: bg-gradient -> bg-linear */}
        <h1 className="text-center text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 drop-shadow-lg mb-2">
          Baruda
        </h1>
        <p className="text-center text-gray-400 mb-6 text-sm tracking-widest uppercase">
          Personal Knowledge Navigator
        </p>

        {result && (
          <div className="w-full mb-6 animate-fade-in rounded-2xl border border-white/10 bg-black/80 p-6 text-white shadow-2xl backdrop-blur-xl">
            <h3 className="font-bold text-lg text-blue-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              {/* [수정 4] ★핵심 에러 수정★: 작은따옴표(')를 &apos;로 변경 */}
              Baruda&apos;s Insight
            </h3>
            <p className="mb-4 leading-relaxed text-gray-200 text-sm">
              {result.answer}
            </p>
            <div className="flex flex-wrap gap-2 mt-4 border-t border-white/10 pt-3">
              {result.sources.map((src) => (
                <span
                  key={src}
                  className="px-2 py-1 text-[10px] rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30"
                >
                  📄 {src}
                </span>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mb-6 flex justify-center items-center gap-2">
            <span className="text-blue-400 text-sm animate-pulse">
              Thinking...
            </span>
          </div>
        )}

        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            {/* [수정 5] Tailwind v4 문법 적용 */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-full opacity-50 group-hover:opacity-100 transition duration-500 blur"></div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              placeholder="Ask anything..."
              className="relative w-full rounded-full border-none bg-black p-4 px-6 text-white placeholder-gray-500 focus:outline-none focus:ring-0 transition-all shadow-xl text-lg"
            />
          </div>
        </form>
      </div>
    </main>
  );
}
