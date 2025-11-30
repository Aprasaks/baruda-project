# backend/main.py

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # [!!!] CORS 필수

app = FastAPI()

# 1. CORS 설정 (프론트엔드가 백엔드에 접근할 수 있게 허용)
origins = [
    "http://localhost:3000", # 로컬 개발 환경
    "*" # [주의] 배포 시에는 Vercel 도메인으로 바꿔야 안전하지만, 테스트용으로 전체 허용
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 파일 경로 설정
DOCS_DIRECTORY = "/app/docs"

@app.get("/")
def read_root():
    return {"message": "Baruda Backend is Running!"}

# [!!!] 실제 파일 목록을 노드로 변환해주는 API
@app.get("/graph-data")
def get_graph_data():
    try:
        # docs 폴더가 없으면 에러 방지
        if not os.path.exists(DOCS_DIRECTORY):
            return {"nodes": []}
            
        # .md 파일만 찾아서 리스트로 반환
        files = [f for f in os.listdir(DOCS_DIRECTORY) if f.endswith('.md')]
        return {"nodes": files}
    except Exception as e:
        print(f"Error: {e}")
        return {"nodes": []}

# (나중에 RAG 로직이 들어갈 곳)
@app.get("/ask")
def ask_question(question: str):
    return {"answer": "아직 AI 두뇌가 연결되지 않았습니다. (Mock Response)", "sources": []}