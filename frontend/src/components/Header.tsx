// src/components/Header.tsx

export default function Header() {
  // 포트폴리오 링크 배열 정의
  const portfolioLinks = [
    {
      name: "Devs Platform",
      href: "https://www.devsplatform.dev/",
      icon: "💻", // 컴퓨터/개발 상징
      description: "개발자 플랫폼 프로젝트",
    },
    {
      name: "Dev Memory",
      href: "https://www.devmemory.dev/",
      icon: "🧠", // 지식/기억 상징
      description: "개발 메모리 서비스",
    },
    {
      name: "Edith",
      href: "https://edith-sooty.vercel.app/",
      icon: "🔗", // 연결/RAG 상징
      description: "RAG 기반 챗봇 프로젝트",
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-linear-to-b from-black/90 to-transparent backdrop-blur-[2px]">
      {/* 1. 로고 / 제목 (좌측) */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 drop-shadow-lg cursor-pointer">
          Baruda
        </h1>
        <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1">
          Personal Knowledge Navigator
        </span>
      </div>

      {/* 2. 포트폴리오 링크 (우측) */}
      <div className="flex gap-4">
        {portfolioLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.description} // 마우스 오버 시 설명 표시
            className="text-2xl opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </header>
  );
}
