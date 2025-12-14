// src/app/page.tsx

"use client";

import { useState, useEffect } from "react";
import KnowledgeGraphBackground from "@/components/KnowledgeGraphBackground";
import Header from "@/components/Header";

interface SearchResult {
  answer: string;
  sources: string[];
}

// [!!!] 고정된 기본 노드 리스트 정의
const FALLBACK_NODES = [
  "Portfolio_Project_1",
  "Portfolio_Project_2",
  "Side_Project_A",
  "Skill_React",
  "Skill_Python",
  "Certificate_AWS",
  "Experience_B",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [highlightNodes, setHighlightNodes] = useState<string[]>([]);
  // [!!!] dataNodes를 기본값으로 초기화
  const [dataNodes, setDataNodes] = useState<string[]>(FALLBACK_NODES);

  // [!!!] 백엔드 연결 useEffect 제거
  /*
  useEffect(() => {
    const fetchNodes = async () => {
      // ... (백엔드 연결 코드 전체 제거)
    };
    fetchNodes();
  }, []);
  */

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setHighlightNodes([]);

    // [!!!] 2초 대기 (AI가 생각하는 척)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // [!!!] Mock 데이터 생성 (검색 시 포트폴리오 항목 2개 랜덤 하이라이트)
    const randomSources = FALLBACK_NODES.sort(() => 0.5 - Math.random()).slice(
      0,
      2
    );

    const fakeResponse: SearchResult = {
      // [!!!] 포트폴리오용 Mock 답변
      answer: `"${query}" 관련 항목을 포트폴리오에서 찾았습니다. 이 주제는 ${randomSources[0]}와 연결된 핵심 기술 스택을 활용합니다.`,
      sources: randomSources,
    };

    setResult(fakeResponse);
    setHighlightNodes(randomSources);
    setIsLoading(false);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-end overflow-hidden p-6 pb-20">
      {/* 배경 그래프 */}
      <KnowledgeGraphBackground
        highlightNodes={highlightNodes}
        dataNodes={dataNodes}
      />

      {/* 상단 고정 헤더 */}
      <Header />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center transition-all duration-500">
        {/* 결과 표시 영역 */}
        {result && (
          <div className="w-full mb-6 animate-fade-in rounded-2xl border border-white/10 bg-black/80 p-6 text-white shadow-2xl backdrop-blur-xl">
            <h3 className="font-bold text-lg text-blue-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Portfolio Insight
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

        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="mb-6 flex justify-center items-center gap-2">
            <span className="text-blue-400 text-sm animate-pulse">
              Searching...
            </span>
          </div>
        )}

        {/* 검색창 */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-full opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              placeholder="포트폴리오에 대해 무엇이 궁금하신가요?"
              className="relative w-full rounded-full border-none bg-black/90 p-4 px-6 text-white placeholder-gray-500 focus:outline-none focus:ring-0 transition-all shadow-xl text-lg"
            />
          </div>
        </form>
      </div>
    </main>
  );
}
