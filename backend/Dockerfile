# backend/Dockerfile

# 1. Python 3.11 Slim 버전 사용 (가볍고 효율적)
FROM python:3.11-slim

# 2. 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 3. requirements.txt 복사 및 의존성 설치
# 이 단계는 변하지 않으므로 캐싱 효과를 높임
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. FastAPI 앱 코드 복사
COPY . .

# 5. FastAPI 앱이 사용하는 포트(8000번) 노출
EXPOSE 8000

# 6. 컨테이너 시작 시 실행될 명령어 (Uvicorn 웹 서버로 FastAPI 앱 실행)
# 0.0.0.0으로 바인딩해야 컨테이너 외부에서 접근 가능
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]