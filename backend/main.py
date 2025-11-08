# backend/main.py

from fastapi import FastAPI
import os  # 'os' 라이브러리를 임포트해서 파일 시스템에 접근

app = FastAPI()

# (★새로 추가★) 컨테이너 내부의 /app/docs 경로
DOCS_DIRECTORY = "/app/docs" 

@app.get("/")
def read_root():
    return {"message": "안녕하세요! 여기는 Baruda 백엔드입니다."}

@app.get("/ask")
def ask_question(question: str):
    return {"question_received": question, "answer": "아직 생각 중입니다..."}


# [!!!] (★새로 추가★) [!!!]
# /documents 엔드포인트: 지식창고(/app/docs)의 파일 목록을 반환
@app.get("/documents")
def get_documents():
    try:
        # Docker 컨테이너 내부의 DOCS_DIRECTORY에서 파일 목록을 읽어옵니다.
        files = os.listdir(DOCS_DIRECTORY)
        if not files:
            return {"message": "docs 폴더는 존재하지만 비어있습니다."}
        
        return {"documents": files}
    
    except FileNotFoundError:
        return {"error": f"'{DOCS_DIRECTORY}' 폴더를 찾을 수 없습니다. (docker-compose.yml 볼륨 마운트 설정 확인 필요)"}
    except Exception as e:
        return {"error": str(e)}