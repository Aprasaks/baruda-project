// src/components/KnowledgeGraphBackground.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { SimulationNodeDatum } from "d3";

const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};

interface GraphNode extends SimulationNodeDatum {
  id: string;
}

interface KnowledgeGraphProps {
  highlightNodes: string[];
  dataNodes: string[];
}

const KnowledgeGraphBackground: React.FC<KnowledgeGraphProps> = ({
  highlightNodes,
  dataNodes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { width, height } = useWindowSize();
  const [hasMounted, setHasMounted] = useState(false);

  const simulationRef = useRef<d3.Simulation<GraphNode, undefined> | null>(
    null
  );
  const nodesRef = useRef<GraphNode[]>([]);
  const highlightSetRef = useRef(new Set<string>());

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    highlightSetRef.current = new Set(highlightNodes);
    if (simulationRef.current) {
      simulationRef.current.alpha(0.1).restart();
    }
  }, [highlightNodes]);

  useEffect(() => {
    if (!canvasRef.current || width === 0 || height === 0) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const displayNodes =
      dataNodes.length > 0
        ? dataNodes
        : ["Baruda", "AI", "Knowledge", "Docs", "System"];

    nodesRef.current = displayNodes.map((id) => ({ id }));

    simulationRef.current = d3
      .forceSimulation<GraphNode>(nodesRef.current)

      // [★수정★] 중심점을 화면 상단(35% 지점)으로 이동!
      // 이렇게 하면 UI가 있는 하단은 비워두고, 상단에 별들이 모입니다.
      .force("center", d3.forceCenter(width / 2, height * 0.35).strength(0.05))

      .force("charge", d3.forceManyBody().strength(-20))
      .force("collide", d3.forceCollide().radius(15));

    const ticked = () => {
      if (!context) return;
      context.clearRect(0, 0, width, height);

      nodesRef.current.forEach((node) => {
        if (typeof node.x === "number" && typeof node.y === "number") {
          const isHighlighted = highlightSetRef.current.has(node.id);

          context.beginPath();

          if (isHighlighted) {
            // [★수정★] 하이라이트: 네온 블루 (Cyberpunk 느낌)
            context.shadowBlur = 30;
            context.shadowColor = "#00ffff"; // Cyan glow
            context.fillStyle = "#e0ffff"; // Light Cyan body

            context.arc(node.x, node.y, 8, 0, 2 * Math.PI); // 크기 더 키움
          } else {
            // [★수정★] 평소: 조금 더 밝게 해서 잘 보이게 함
            context.shadowBlur = 0;
            context.shadowColor = "transparent";
            context.fillStyle = "rgba(255, 255, 255, 0.6)"; // 0.3 -> 0.6

            context.arc(node.x, node.y, 3, 0, 2 * Math.PI);
          }

          context.fill();

          // 텍스트 라벨 (하이라이트 시에만)
          if (isHighlighted) {
            context.font = "bold 14px sans-serif";
            context.fillStyle = "#00ffff"; // Cyan text
            context.fillText(node.id, node.x + 12, node.y + 5);
          }
        }
      });
    };

    simulationRef.current.on("tick", ticked);
    return () => {
      simulationRef.current?.stop();
    };
  }, [width, height, dataNodes]);

  // 마우스 인터랙션
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mouseMoveHandler = (event: MouseEvent) => {
      const [x, y] = d3.pointer(event, canvas);
      const radius = 120;
      const strength = 2.0;
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
  }, []);

  if (!hasMounted) return null;

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
        backgroundColor: "#050505", // 거의 완벽한 검정
      }}
    />
  );
};

export default KnowledgeGraphBackground;
