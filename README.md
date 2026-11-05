# BreastCare AI

## Structure
- `ml/`          training script + dataset + saved model (artifacts/)
- `ml-service/`  FastAPI service (POST /predict, GET /health)
- `backend/`     Node.js + Express + MongoDB   (next phase)
- `frontend/`    Next.js + Tailwind + shadcn/ui (next phase)

## Phase 2: train
1. Download `breast-cancer-wisconsin.data` from the UCI repository into `ml/data/`
2. `cd ml && pip install -r requirements.txt && python train.py`
3. `cd ../ml-service && pip install -r requirements.txt && uvicorn main:app --port 8000`

> Educational prototype, not a medical diagnostic tool.
