// src/components/Header.tsx

export default function Header() {
  return (
    // [수정 1] bg-gradient-to-b -> bg-linear-to-b
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-linear-to-b from-black/90 to-transparent backdrop-blur-[2px]">
      {/* 로고 / 제목 */}
      <div className="flex flex-col">
        {/* [수정 2] bg-gradient-to-r -> bg-linear-to-r */}
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 drop-shadow-lg cursor-pointer">
          Baruda
        </h1>
        <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1">
          Personal Knowledge Navigator
        </span>
      </div>

      <div className="flex gap-4">{/* 우측 메뉴 자리 */}</div>
    </header>
  );
}
