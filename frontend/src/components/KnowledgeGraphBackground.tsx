// src/components/KnowledgeGraphBackground.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// (1) D3.js의 노드 타입을 import
import type { SimulationNodeDatum } from "d3";

// (2) 'window' 오류 해결용 커스텀 훅 (그대로)
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

// (3) TypeScript용 커스텀 노드 타입 정의 (그대로)
interface GraphNode extends SimulationNodeDatum {
  id: string;
}

// (4) 메인 컴포넌트
const KnowledgeGraphBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { width, height } = useWindowSize();

  // (★중요★) 시뮬레이션 객체와 노드 데이터를 ref로 관리
  const simulationRef = useRef<d3.Simulation<GraphNode, undefined> | null>(
    null
  );
  const nodesRef = useRef<GraphNode[]>([]);

  // D3 시뮬레이션 설정 (초기화)
  useEffect(() => {
    if (!canvasRef.current || width === 0 || height === 0) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // 데이터 생성
    const nodeCount = 300;
    const linkCount = 500;

    // (★수정★) 노드 데이터를 ref에 저장
    nodesRef.current = d3.range(nodeCount).map((i) => ({ id: `node-${i}` }));

    const links = d3.range(linkCount).map(() => ({
      source: nodesRef.current[Math.floor(Math.random() * nodeCount)],
      target: nodesRef.current[Math.floor(Math.random() * nodeCount)],
    }));

    // 시뮬레이션 설정
    simulationRef.current = d3
      .forceSimulation<GraphNode>(nodesRef.current) // (★수정★)
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01))
      .force("charge", d3.forceManyBody().strength(-5))
      .force("collide", d3.forceCollide().radius(5))
      .force("link", d3.forceLink(links).strength(0.01).distance(20));

    // 애니메이션 함수 (ticked)
    const ticked = () => {
      if (!context) return;
      context.clearRect(0, 0, width, height);

      // 선 그리기
      context.strokeStyle = "rgba(255, 255, 255, 0.1)";
      context.beginPath();
      links.forEach((link) => {
        const sourceNode = link.source as GraphNode;
        const targetNode = link.target as GraphNode;
        if (sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
          context.moveTo(sourceNode.x, sourceNode.y);
          context.lineTo(targetNode.x, targetNode.y);
        }
      });
      context.stroke();

      // 점 그리기
      context.fillStyle = "rgba(255, 255, 255, 0.5)";
      nodesRef.current.forEach((node) => {
        // (★수정★)
        if (typeof node.x === "number" && typeof node.y === "number") {
          context.beginPath();
          context.arc(node.x, node.y, 2, 0, 2 * Math.PI);
          context.fill();
        }
      });
    };

    simulationRef.current.on("tick", ticked);

    return () => {
      simulationRef.current?.stop();
    };
  }, [width, height]);

  // (5) [!!!] 마우스 인터랙션 로직 (★완전히 수정됨★)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mouseMoveHandler = (event: MouseEvent) => {
      const [x, y] = d3.pointer(event, canvas);
      const radius = 60; // 마우스 영향 반경 (조절 가능)
      const strength = 0.5; // '툭 치는' 힘 (조절 가능)

      // ref에 저장된 노드들에 직접 접근
      nodesRef.current.forEach((node) => {
        if (node.x && node.y) {
          const dx = node.x - x;
          const dy = node.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // 마우스 반경 안에 있다면
          if (dist < radius) {
            // (★핵심★) '힘(force)' 대신 '속도(velocity)'를 직접 건드림
            // '툭' 쳐서 밀려나게 합니다.
            node.vx = (node.vx || 0) + (dx / dist) * strength;
            node.vy = (node.vy || 0) + (dy / dist) * strength;
          }
        }
      });

      // 시뮬레이션에 '노드 위치가 바뀌었으니 다시 활성화해!'라고 알림
      simulationRef.current?.alpha(0.3).restart();
    };

    // (★수정★) 마우스가 떠났을 때의 핸들러가 더 이상 필요 없습니다.
    // '툭' 치는 것은 일시적이라, 마우스가 떠나면 자동으로 멈춥니다.
    canvas.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []); // (★수정★) 이 effect는 width/height와 무관하게 한 번만 실행

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
