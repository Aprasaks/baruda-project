// src/app/page.tsx

"use client"; // state와 effect를 사용하므로 클라이언트 컴포넌트 선언

import { useState } from "react";
import KnowledgeGraphBackground from "@/components/KnowledgeGraphBackground";

// (나중에 API 응답을 받으면 이 타입을 사용할 수 있습니다)
interface SearchResult {
  answer: string;
  sources: string[];
}

export default function Home() {
  // 1. FE 상태 관리
  const [query, setQuery] = useState(""); // 사용자의 검색어
  const [isLoading, setIsLoading] = useState(false); // API 호출 중(로딩) 상태
  const [result, setResult] = useState<SearchResult | null>(null); // 백엔드 응답 결과
  const [highlightNodes, setHighlightNodes] = useState<string[]>([]); // 배경 그래프에 하이라이트할 노드 ID 목록

  // 2. 검색 폼 제출(Enter) 시 실행될 함수
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 기본 동작인 페이지 새로고침 방지
    if (!query || isLoading) return; // 검색어가 없거나 로딩 중이면 실행 방지

    setIsLoading(true);
    setResult(null);
    setHighlightNodes([]); // 이전 하이라이트 초기화

    // --- Mock API 호출 시뮬레이션 ---
    // 2초간 '생각하는 시간'을 줍니다.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // ---------------------------------

    // (가짜 응답) 300개의 노드 ID 중에서 랜덤으로 몇 개를 골라 출처라고 가정합니다.
    const fakeSources = [
      "node-10",
      "node-42",
      "node-112",
      "node-205",
      "node-280",
    ];

    // (가짜 응답) 실제 백엔드가 반환할 JSON 객체 형식
    const fakeResponse: SearchResult = {
      answer:
        "이것은 2초간의 가짜 API 응답입니다. 백엔드가 준비되면 이 메시지는 실제 LLM의 답변으로 대체됩니다.",
      sources: fakeSources,
    };

    // 상태 업데이트
    setResult(fakeResponse);
    setHighlightNodes(fakeResponse.sources); // (★핵심★) 이 ID들을 배경 컴포넌트로 전달!
    setIsLoading(false);
  };

  // 3. 렌더링할 JSX
  return (
    // overflow-hidden: 배경 애니메이션이 화면 밖으로 삐져나가지 않도록
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Layer 3: 지식 그래프 배경 */}
      {/* (★수정★) highlightNodes 상태를 prop으로 전달 */}
      <KnowledgeGraphBackground highlightNodes={highlightNodes} />

      {/* Layer 2: 중앙 UI 영역 */}
      <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white/10 p-8 shadow-2xl backdrop-blur-md transition-all duration-300">
        <h1 className="text-center text-3xl font-bold text-white">Baruda</h1>
        <p className="mt-2 text-center text-gray-300">
          무한의 지식 서고에서 답을 탐색하세요.
        </p>

        {/* (★수정★) 폼으로 감싸고 onSubmit 연결 */}
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query} // state와 input 값을 동기화
            onChange={(e) => setQuery(e.target.value)} // 입력할 때마다 state 변경
            disabled={isLoading} // 로딩 중일 땐 입력창 비활성화
            placeholder={
              isLoading
                ? "Baruda가 생각 중입니다..."
                : "궁금한 개발 지식을 검색하세요..."
            }
            className="mt-6 w-full rounded-md border border-gray-500 bg-transparent p-3 text-white placeholder-gray-400 focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all disabled:opacity-50"
          />
        </form>

        {/* (★새로 추가★) 결과 표시 영역 */}
        {/* 최소 높이를 지정해 로딩/결과에 따라 UI가 덜컹거리는 것을 방지 */}
        <div className="mt-6 min-h-[150px]">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-300 animate-pulse">
                답변을 생성 중입니다...
              </p>
            </div>
          )}

          {result && (
            // (참고) animate-fade-in은 tailwind.config.ts에 keyframes 추가가 필요합니다.
            <div className="animate-fade-in rounded-md bg-black/30 p-4 text-white text-sm">
              <h3 className="font-bold text-base mb-2">Baruda의 답변:</h3>
              <p className="mb-4 leading-relaxed">{result.answer}</p>
              <h4 className="font-semibold text-xs text-gray-400">
                참조한 지식 (출처):
              </h4>
              <ul className="list-disc list-inside text-xs text-gray-400">
                {result.sources.map((src) => (
                  <li key={src}>{src}.md (가상 파일)</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
