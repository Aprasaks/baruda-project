# backend/main.py

from fastapi import FastAPI
from langchain_community.document_loaders import DirectoryLoader

# [!!!] (★경로 수정★) [!!!]
# 'langchain.text_splitter'가 아니라 'langchain_text_splitters'에서 가져옵니다.
from langchain_text_splitters import RecursiveCharacterTextSplitter

app = FastAPI()

# --- 전역 설정 ---
DOCS_DIRECTORY = "/app/docs"

# 1. 문서 로더 초기화
loader = DirectoryLoader(DOCS_DIRECTORY, glob="**/*.md", show_progress=True)

# 2. 텍스트 분할기 초기화
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
# --- 전역 설정 끝 ---


@app.get("/")
def read_root():
    return {"message": "안녕하세요! 여기는 Baruda 백엔드입니다."}

@app.get("/documents")
def get_documents():
    try:
        documents = loader.load()
        if not documents:
            return {"message": "docs 폴더에서 .md 파일을 찾을 수 없습니다."}
        
        return {
            "document_count": len(documents),
            "first_document_content_preview": documents[0].page_content[:200] + "..."
        }
    except Exception as e:
        return {"error": f"문서 로드 중 오류 발생: {str(e)}"}


# /split 엔드포인트 (기존과 동일)
@app.get("/split")
def split_documents():
    try:
        print("문서 로드를 시작합니다...")
        documents = loader.load()
        if not documents:
            return {"error": ".md 파일을 찾을 수 없습니다."}

        print(f"{len(documents)}개의 문서를 분할합니다...")
        chunks = text_splitter.split_documents(documents)

        print(f"총 {len(chunks)}개의 청크로 분할 완료.")
        
        return {
            "message": f"총 {len(documents)}개의 문서를 {len(chunks)}개의 청크로 분할했습니다.",
            "first_chunk_preview": chunks[0].page_content[:200] + "...",
            "total_document_count": len(documents),
            "total_chunk_count": len(chunks)
        }
    
    except Exception as e:
        return {"error": f"문서 분할 중 오류 발생: {str(e)}"}


# /ask 엔드포인트 (아직은 가짜)
@app.get("/ask")
def ask_question(question: str):
    return {"question_received": question, "answer": "아직 생각 중입니다..."}