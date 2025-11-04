# backend/main.py

from fastapi import FastAPI

# FastAPI 앱 인스턴스 생성
app = FastAPI()

# "/" (루트 URL) 경로로 GET 요청이 오면
@app.get("/")
def read_root():
    # 이 JSON을 반환
    return {"message": "안녕하세요! 여기는 Baruda 백엔드입니다."}

# (나중에 만들 /ask 엔드포인트 예시)
@app.get("/ask")
def ask_question(question: str):
    return {"question_received": question, "answer": "아직 생각 중입니다..."}