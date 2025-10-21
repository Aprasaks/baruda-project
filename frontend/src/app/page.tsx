import KnowledgeGraphBackground from "@/components/KnowledgeGraphBackground";

export default function Home() {
  return (
    // relative: 자식 요소의 absolute/fixed 배치를 위한 기준점
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Layer 3: 지식 그래프 배경 (z-1) */}
      <KnowledgeGraphBackground />

      {/* Layer 2: 중앙 검색창 (z-10) */}
      <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white/10 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="text-center text-3xl font-bold text-white">Baruda</h1>
        <p className="mt-2 text-center text-gray-300">
          무한의 지식 서고에서 답을 탐색하세요.
        </p>
        <input
          type="text"
          placeholder="궁금한 개발 지식을 검색하세요..."
          className="mt-6 w-full rounded-md border border-gray-500 bg-transparent p-3 text-white placeholder-gray-400 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
        />
      </div>
    </main>
  );
}
