# 🐳 Baruda: 개발자 지식 기반 LLM 멘토 (RAG System)

**'나만의 개발 지식'만을 기반으로 정확하게 추론하고, 그 근거를 제시하는 AI 멘토 시스템**

## 1. 프로젝트 개요 (Overview)

**Baruda**는 기존 상용 LLM이 가진 '환각(Hallucination)' 현상과 '정보 통제 실패' 문제를 해결하기 위해 설계된 RAG(검색 증강 생성) 시스템입니다.

사용자가 제공하는 개발 서적, 기술 문서, 마크다운 파일(`docs/`)만을 유일한 지식 기반으로 삼아, 오픈소스 LLM(Ollama)과 벡터 DB(ChromaDB)를 결합하여 질문에 답변합니다. 이를 통해 **"인터넷의 일반 지식"이 아닌 "개발자 본인의 지식"**에 기반한 정확하고 신뢰할 수 있는 답변을 생성하는 것을 목표로 합니다.

본 프로젝트는 현업 표준인 **Docker 컨테이너 환경**에서 Next.js(FE)와 FastAPI(BE)를 분리 운영하여, 재현 가능하고 안정적인 개발 및 배포 환경을 지향합니다.

## 2. 시스템 아키텍처 (System Architecture)

본 프로젝트는 FE와 BE를 명확히 분리하며, BE와 LLM 환경은 Docker를 통해 격리 및 관리합니다.

| 구분 | 기술 스택 | 주요 역할 | 실행 환경 |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js, TypeScript, Tailwind CSS | **UI/UX 및 지식 시각화**<br/>- '무한서고' 컨셉의 인터랙티브 UI 구현<br/>- RAG 추론 결과(답변, 출처) 시각화 | **Local (`npm run dev`)** |
| **Backend** | Python, FastAPI, LangChain, ChromaDB | **RAG 핵심 로직 (The Brain)**<br/>- 지식 문서 Chunking 및 Embedding<br/>- Vector DB 검색 및 Ollama 추론<br/>- `/ask` API (답변 + 출처 목록) 제공 | **Docker Container** |
| **Infra** | Docker, Docker Compose, Ollama | **격리된 AI/BE 환경**<br/>- Ollama LLM 서버 안정적 운영<br/>- BE/LLM 환경의 종속성 격리<jbr/>- 재현 가능한 실행 환경 보장 | **Docker Container** |

## 3. 개발 전략: 하이브리드 개발 환경

* **문제:** 초기 환경 구축 중, Next.js의 HMR(Hot Module Replacement), Tailwind CSS JIT 엔진과 Docker 볼륨 마운트 간의 복잡한 설정 충돌 및 성능 저하 문제에 직면했습니다.
* **결정:** 개발 효율성과 안정성을 모두 확보하기 위해, 환경을 전략적으로 분리합니다.
    * **FE (Local):** `npm run dev`를 통해 HMR의 이점을 극대화하며 UI 개발 속도를 확보합니다.
    * **BE/LLM (Docker):** FastAPI와 Ollama를 컨테이너로 격리하여, 안정적이고 일관된 RAG 백엔드 환경을 유지합니다.

## 4. 폴더 구조

baruda-project/
├── 📁 frontend/   
├── 📁 backend/ 
├── 📁 docs/        
├── 📄 .gitignore
├── 📄 docker-compose.yml
└── 📄 README.md    


## 5. 개발 로드맵 (Roadmap)

| Phase | 주요 목표 | 상세 내용 |
| :--- | :--- | :--- |
| **Phase 1 (Current)** | **FE 디자인 및 Mock 연동** | (FE 집중) '무한서고' 컨셉의 인터랙티브 UI/UX 디자인 완성. (D3.js 등 활용). Mock API 연동을 통한 UI 반응성 테스트. |
| **Phase 2** | **BE RAG Core 구현** | `docs/` 지식 문서를 `langchain`으로 처리 및 `ChromaDB` 저장. `/ask` 엔드포인트에 `Ollama` 추론을 결합한 RAG 파이P라인 구축 완료. |
| **Phase 3** | **통합 및 테스트** | FE와 BE의 실제 API 연동. RAG 성능 평가 및 지식 기반 답변의 정확도 검증. |
| **Phase 4** | **배포 (Deployment)** | Docker 이미지를 빌드하여 클라우드 서비스에 배포. |

