# backend/main.py

from fastapi import FastAPI
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings
# [!!!] Ollama 추론을 위해 LLM 클래스도 미리 임포트합니다.
from langchain_community.llms import Ollama

app = FastAPI()

# --- 전역 설정 (서버 시작 시 1회만 실행) ---
DOCS_DIRECTORY = "/app/docs"
CHROMA_PATH = "chroma_db"
OLLAMA_MODEL = "llama2"
# [!!!] (★수정된 핵심★) Ollama 서비스 이름 사용 (컨테이너 간 통신)
OLLAMA_HOST = "http://ollama:11434" 

# 1. 문서 로더 초기화
loader = DirectoryLoader(DOCS_DIRECTORY, glob="**/*.md", show_progress=True)

# 2. 텍스트 분할기 초기화
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

# 3. Ollama 임베딩 모델 설정
embeddings = OllamaEmbeddings(
    model=OLLAMA_MODEL, 
    base_url=OLLAMA_HOST  # <-- Ollama 서비스 주소 명시
)

# 4. Ollama LLM 추론 모델 설정 (미리 설정)
llm = Ollama(model=OLLAMA_MODEL, base_url=OLLAMA_HOST)
# --- 전역 설정 끝 ---


@app.get("/")
def read_root():
    return {"message": "안녕하세요! 여기는 Baruda 백엔드입니다."}

@app.get("/split")
def split_documents():
    """문서 로드 및 분할 테스트"""
    try:
        documents = loader.load()
        if not documents:
            return {"error": ".md 파일을 찾을 수 없습니다."}
        chunks = text_splitter.split_documents(documents)
        return {
            "message": f"총 {len(documents)}개의 문서를 {len(chunks)}개의 청크로 분할했습니다.",
            "total_chunk_count": len(chunks)
        }
    except Exception as e:
        return {"error": f"문서 분할 중 오류 발생: {str(e)}"}


@app.get("/embed")
def create_embeddings():
    """
    문서를 로드, 분할한 뒤, Ollama 임베딩을 이용해 벡터 DB(Chroma)에 저장합니다.
    """
    try:
        # 1. 문서 로드 및 분할 (Load & Split)
        documents = loader.load()
        if not documents:
            return {"error": "로드할 문서가 없습니다."}
        
        chunks = text_splitter.split_documents(documents)
        
        # 2. 벡터 저장소에 저장 (Embed & Store)
        # Chroma.from_documents()가 임베딩과 저장을 동시에 수행합니다.
        vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=CHROMA_PATH  # 데이터가 저장될 경로
        )
        
        # 3. 데이터베이스 디스크에 쓰기 (저장)
        vector_store.persist() 
        
        return {
            "message": "임베딩 및 벡터 저장소 구축 성공.",
            "total_chunks_processed": len(chunks),
            "storage_path": CHROMA_PATH
        }
    
    except Exception as e:
        # Ollama 연결 오류가 발생하면, 호스트 문제임을 명시합니다.
        return {"error": f"임베딩 중 오류 발생. Ollama 연결 주소({OLLAMA_HOST})와 컨테이너 상태를 확인하세요: {str(e)}"}


@app.get("/ask")
def ask_question(question: str):
    """(아직은 가짜) 추론 엔드포인트"""
    return {"question_received": question, "answer": "아직 생각 중입니다..."}