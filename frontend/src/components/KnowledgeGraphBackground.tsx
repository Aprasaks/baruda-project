// src/components/KnowledgeGraphBackground.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// ------------------------------------------------------------------
// (1) D3.js의 노드 타입을 import 합니다. (★수정됨★)
// ------------------------------------------------------------------
import type { SimulationNodeDatum } from "d3";

// ------------------------------------------------------------------
// (2) 'window' 오류 해결용 커스텀 훅 (그대로)
// ------------------------------------------------------------------
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};

// ------------------------------------------------------------------
// (3) 우리만의 노드 타입을 정의합니다. (★추가됨★)
// D3의 SimulationNodeDatum을 '확장(extends)'해서
// x, y 속성을 포함하도록 TypeScript에 알립니다.
// ------------------------------------------------------------------
interface GraphNode extends SimulationNodeDatum {
  id: string;
}

// ------------------------------------------------------------------
// (4) 메인 컴포넌트
// ------------------------------------------------------------------
const KnowledgeGraphBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!canvasRef.current || width === 0 || height === 0) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // 5. 가짜 데이터 생성 (★수정됨: GraphNode[] 타입 지정★)
    const nodeCount = 50;
    const nodes: GraphNode[] = d3.range(nodeCount).map((i) => ({
      id: `node-${i}`,
      // x, y는 D3가 추가해 줄 것이므로 여기선 비워둡니다.
    }));

    // 6. D3 시뮬레이션 설정 (★수정됨: <GraphNode> 제네릭 타입 전달★)
    // D3에게 "이 시뮬레이션은 GraphNode 타입의 노드를 쓴다"고 알립니다.
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-10))
      .force("collide", d3.forceCollide().radius(5));

    // 7. 애니메이션 프레임마다 실행될 함수
    const ticked = () => {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(255, 255, 255, 0.7)";

      // 8. 노드 그리기 (★수정됨: x, y 존재 여부 확인★)
      // D3가 x, y를 계산해 줬는지 TypeScript가 알 수 있게 확인합니다.
      nodes.forEach((node) => {
        if (typeof node.x === "number" && typeof node.y === "number") {
          context.beginPath();
          context.arc(node.x, node.y, 3, 0, 2 * Math.PI);
          context.fill();
        }
      });
    };

    // 9. 시뮬레이션 시작 및 클린업 (그대로)
    simulation.on("tick", ticked);
    return () => {
      simulation.stop();
    };
  }, [width, height]);

  // 10. 렌더링 JSX (그대로)
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: "#1a1a1a",
      }}
    />
  );
};

export default KnowledgeGraphBackground;
