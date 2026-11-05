from pathlib import Path
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field

MODEL_PATH = Path(__file__).parent.parent / "ml" / "artifacts" / "model.joblib"
bundle = joblib.load(MODEL_PATH)
pipeline, FEATURES = bundle["pipeline"], bundle["features"]

app = FastAPI(title="BreastCare AI - ML Service")


def F():
    return Field(ge=1, le=10)


class Measurements(BaseModel):
    clump_thickness: int = F()
    uniformity_cell_size: int = F()
    uniformity_cell_shape: int = F()
    marginal_adhesion: int = F()
    single_epithelial_cell_size: int = F()
    bare_nuclei: int = F()
    bland_chromatin: int = F()
    normal_nucleoli: int = F()
    mitoses: int = F()


@app.get("/health")
def health():
    return {"status": "ok", "model": bundle["model_name"]}


@app.post("/predict")
def predict(m: Measurements):
    X = pd.DataFrame([m.model_dump()])[FEATURES]
    label = int(pipeline.predict(X)[0])
    p_mal = float(pipeline.predict_proba(X)[0][1])
    return {
        "predicted_class": "Malignant" if label else "Benign",
        "class_code": 4 if label else 2,
        "probability": round(p_mal if label else 1 - p_mal, 4),
        "malignant_probability": round(p_mal, 4),
    }
