// src/components/KnowledgeGraphBackground.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// (1) D3.js의 노드 타입을 import
import type { SimulationNodeDatum } from "d3";

// (2) 'window' 오류 해결용 커스텀 훅 (변경 없음)
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

// (3) TypeScript용 커스텀 노드 타입 정의 (변경 없음)
interface GraphNode extends SimulationNodeDatum {
  id: string;
}

// (4) 컴포넌트가 받을 Props 타입 정의 (변경 없음)
interface KnowledgeGraphProps {
  highlightNodes: string[];
}

// (5) 메인 컴포넌트
const KnowledgeGraphBackground: React.FC<KnowledgeGraphProps> = ({
  highlightNodes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { width, height } = useWindowSize();

  // (★핵심★) D3 데이터/시뮬레이션을 Ref에 저장하여 리렌더링 시에도 유지
  const simulationRef = useRef<d3.Simulation<GraphNode, undefined> | null>(
    null
  );
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<any[]>([]); // 링크 데이터도 Ref로 관리

  // (★핵심★) 하이라이트 목록을 Ref로 관리
  // D3의 'ticked' 함수가 React의 state 변경을 감지하지 못하므로,
  // Ref를 사용해 최신 prop 값을 'ticked' 함수가 읽을 수 있도록 연결
  const highlightSetRef = useRef(new Set<string>());

  // [!!!] 로직 1: 하이라이트 Prop이 변경되면 Ref만 업데이트
  // 이 Effect는 시뮬레이션을 재시작하지 않습니다!
  useEffect(() => {
    highlightSetRef.current = new Set(highlightNodes);
  }, [highlightNodes]);

  // [!!!] 로직 2: D3 시뮬레이션 초기화 (width/height 변경 시에만 실행)
  useEffect(() => {
    if (!canvasRef.current || width === 0 || height === 0) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // (★수정★) 노드와 링크를 한 번만 생성
    const nodeCount = 300;
    const linkCount = 500;

    nodesRef.current = d3.range(nodeCount).map((i) => ({ id: `node-${i}` }));

    linksRef.current = d3.range(linkCount).map(() => ({
      source: nodesRef.current[Math.floor(Math.random() * nodeCount)],
      target: nodesRef.current[Math.floor(Math.random() * nodeCount)],
    }));

    // 시뮬레이션 설정
    simulationRef.current = d3
      .forceSimulation<GraphNode>(nodesRef.current)
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01))
      .force("charge", d3.forceManyBody().strength(-5))
      .force("collide", d3.forceCollide().radius(5))
      .force(
        "link",
        d3.forceLink(linksRef.current).strength(0.01).distance(20)
      );

    // 애니메이션 함수 (ticked)
    const ticked = () => {
      if (!context) return;
      context.clearRect(0, 0, width, height);

      // 6-1. 선 그리기
      context.strokeStyle = "rgba(255, 255, 255, 0.1)";
      context.beginPath();
      linksRef.current.forEach((link) => {
        const sourceNode = link.source as GraphNode;
        const targetNode = link.target as GraphNode;
        if (sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
          context.moveTo(sourceNode.x, sourceNode.y);
          context.lineTo(targetNode.x, targetNode.y);
        }
      });
      context.stroke();

      // 6-2. 점 그리기
      nodesRef.current.forEach((node) => {
        if (typeof node.x === "number" && typeof node.y === "number") {
          // [!!!] (★핵심 수정★) State가 아닌 Ref에서 하이라이트 정보 읽기
          const isHighlighted = highlightSetRef.current.has(node.id);

          context.fillStyle = isHighlighted
            ? "rgba(59, 130, 246, 1)" // 밝은 파랑
            : "rgba(255, 255, 255, 0.5)"; // 기본 흰색

          const radius = isHighlighted ? 4 : 2;

          context.beginPath();
          context.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          context.fill();
        }
      });
    };

    simulationRef.current.on("tick", ticked);

    return () => {
      simulationRef.current?.stop();
    };

    // (★핵심 수정★) 이 Effect는 오직 width/height 변경 시에만 재실행
  }, [width, height]);

  // [!!!] 로직 3: 마우스 인터랙션 (수정된 '툭 치기' 방식)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mouseMoveHandler = (event: MouseEvent) => {
      const [x, y] = d3.pointer(event, canvas);
      const radius = 60;
      const strength = 0.5;

      nodesRef.current.forEach((node) => {
        if (node.x && node.y) {
          const dx = node.x - x;
          const dy = node.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius) {
            node.vx = (node.vx || 0) + (dx / dist) * strength;
            node.vy = (node.vy || 0) + (dy / dist) * strength;
          }
        }
      });

      simulationRef.current?.alpha(0.3).restart();
    };

    canvas.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };

    // (★수정★) 이 Effect는 컴포넌트 마운트 시 한 번만 실행
  }, []);

  // (6) 렌더링 JSX (그대로)
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
