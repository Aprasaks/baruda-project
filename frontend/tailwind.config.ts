// frontend/tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  // 1. Tailwind가 CSS를 적용할 파일 경로를 지정합니다.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // 2. 여기에 커스텀 스타일을 확장합니다.
    extend: {
      // [!!!] 우리가 추가하려던 바로 그 애니메이션 설정입니다 [!!!]
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        // 'animate-fade-in' 클래스 이름을 여기서 만듭니다.
        "fade-in": "fade-in 0.5s ease-out forwards",
      },

      // (이건 Next.js 기본값이니 그냥 둡니다)
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
