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

    // 1. 노드 생성 (그대로)
    const nodeCount = 50;
    const nodes: GraphNode[] = d3.range(nodeCount).map((i) => ({
      id: `node-${i}`,
    }));

    // 2. [!!!] 가짜 '링크(선)' 데이터 생성
    // 50개의 노드를 랜덤하게 연결해 봅니다.
    // (D3.js 7버전부터는 link의 source/target에
    //  노드 객체 자체를 전달하는 것이 표준입니다.)
    const links = d3.range(nodeCount).map(() => ({
      source: nodes[Math.floor(Math.random() * nodeCount)], // 랜덤 시작점
      target: nodes[Math.floor(Math.random() * nodeCount)], // 랜덤 끝점
    }));

    // 3. D3 시뮬레이션 설정 (★수정됨: forceLink 추가★)
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-10))
      .force("collide", d3.forceCollide().radius(5))
      // [!!!] 링크(선)가 노드를 서로 끌어당기게 하는 힘 추가
      .force("link", d3.forceLink(links).strength(0.05).distance(30)); // 약한 강도로, 거리 30

    // 4. 애니메이션 프레임마다 실행될 함수 (★수정됨: 선 그리기 추가★)
    const ticked = () => {
      if (!context) return;
      context.clearRect(0, 0, width, height); // 캔버스 지우기

      // 4-1. [!!!] 모든 링크(선) 그리기
      context.strokeStyle = "rgba(255, 255, 255, 0.2)"; // 선 색상 (더 옅게)
      context.beginPath();
      links.forEach((link) => {
        // 'source'와 'target'이 GraphNode 타입임을 TypeScript에 알려줍니다.
        const sourceNode = link.source as GraphNode;
        const targetNode = link.target as GraphNode;

        // 노드의 x, y 좌표가 계산되었는지 확인
        if (sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
          context.moveTo(sourceNode.x, sourceNode.y); // 시작점
          context.lineTo(targetNode.x, targetNode.y); // 끝점
        }
      });
      context.stroke(); // 선 그리기 완료

      // 4-2. 모든 노드(점) 그리기 (그대로)
      context.fillStyle = "rgba(255, 255, 255, 0.7)";
      nodes.forEach((node) => {
        if (typeof node.x === "number" && typeof node.y === "number") {
          context.beginPath();
          context.arc(node.x, node.y, 3, 0, 2 * Math.PI);
          context.fill();
        }
      });
    };

    // 5. 시뮬레이션 시작 및 클린업 (그대로)
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
