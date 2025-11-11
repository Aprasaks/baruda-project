# backend/main.py

from fastapi import FastAPI
# 'os' 라이브러리 대신 LangChain의 DirectoryLoader를 임포트합니다.
from langchain_community.document_loaders import DirectoryLoader

app = FastAPI()

# 컨테이너 내부의 /app/docs 경로
DOCS_DIRECTORY = "/app/docs" 

@app.get("/")
def read_root():
    return {"message": "안녕하세요! 여기는 Baruda 백엔드입니다."}

@app.get("/ask")
def ask_question(question: str):
    return {"question_received": question, "answer": "아직 생각 중입니다..."}

# [!!!] (★엔드포인트 로직 변경★) [!!!]
@app.get("/documents")
def get_documents():
    """
    /app/docs 디렉토리에서 .md 파일들을 로드하여 
    총 몇 개의 문서가 로드되었는지,
    첫 번째 문서의 내용은 무엇인지 반환합니다.
    """
    try:
        # 1. /app/docs 디렉토리에서 .md 파일만 찾도록 설정
        # (show_progress=True는 로드 중 터미널에 진행률을 보여줍니다)
        loader = DirectoryLoader(DOCS_DIRECTORY, glob="**/*.md", show_progress=True)
        
        # 2. 문서를 실제로 로드합니다.
        documents = loader.load()

        if not documents:
            return {"message": "docs 폴더에서 .md 파일을 찾을 수 없습니다."}
        
        # 3. 성공 응답: 문서 개수와 첫 문서 내용(앞 200자)을 반환
        return {
            "document_count": len(documents),
            "first_document_content_preview": documents[0].page_content[:200] + "..."
        }
    
    except Exception as e:
        # 에러 발생 시 상세 내용 반환
        return {"error": f"문서 로드 중 오류 발생: {str(e)}"}