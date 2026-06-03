# RUN LOCAL

## 1. Clone repository

```bash
git clone <repository-url>
cd fit4110-lab03-team-14
```

## 2. Create virtual environment

```bash
python -m venv .venv
```

Activate:

Windows:

```bash
.venv\Scripts\activate
```

Linux/Mac:

```bash
source .venv/bin/activate
```

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

## 4. Run service

```bash
uvicorn ai_vision.main:app --app-dir src --host 0.0.0.0 --port 8000
```

## 5. Verify health endpoint

Open:

```text
http://localhost:8000/health
```

Expected response:

```json
{
  "status": "UP",
  "service": "ai-vision"
}
```
