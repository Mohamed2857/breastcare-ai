"""Train and compare 5 ML algorithms on Breast Cancer Wisconsin (Original).
Usage: python train.py --data data/breast-cancer-wisconsin.data
"""
import argparse, json
from pathlib import Path
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.svm import SVC
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, confusion_matrix, roc_auc_score)

FEATURES = ["clump_thickness", "uniformity_cell_size", "uniformity_cell_shape",
            "marginal_adhesion", "single_epithelial_cell_size", "bare_nuclei",
            "bland_chromatin", "normal_nucleoli", "mitoses"]
SEED = 42


def load(path):
    df = pd.read_csv(path, header=None, na_values="?",
                     names=["id"] + FEATURES + ["class"])
    df = df.drop(columns="id")
    df["target"] = (df["class"] == 4).astype(int)  # 0 = Benign(2), 1 = Malignant(4)
    return df[FEATURES], df["target"]


def models():
    imp = lambda: ("imputer", SimpleImputer(strategy="median"))
    sc = lambda: ("scaler", StandardScaler())
    return {
        "KNN": Pipeline([imp(), sc(), ("clf", KNeighborsClassifier(n_neighbors=5))]),
        "Decision Tree": Pipeline([imp(), ("clf", DecisionTreeClassifier(random_state=SEED))]),
        "Random Forest": Pipeline([imp(), ("clf", RandomForestClassifier(n_estimators=200, random_state=SEED))]),
        "Neural Network (MLP)": Pipeline([imp(), sc(), ("clf", MLPClassifier(hidden_layer_sizes=(32, 16), max_iter=1000, random_state=SEED))]),
        "SVM": Pipeline([imp(), sc(), ("clf", SVC(kernel="rbf", probability=True, random_state=SEED))]),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="data/breast-cancer-wisconsin.data")
    ap.add_argument("--out", default="artifacts")
    a = ap.parse_args()

    X, y = load(a.data)
    print(f"Records: {len(X)} | missing: {int(X.isna().sum().sum())} | malignant: {int(y.sum())}")
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, stratify=y, random_state=SEED)

    results, fitted = [], {}
    for name, pipe in models().items():
        pipe.fit(Xtr, ytr)
        pred = pipe.predict(Xte)
        proba = pipe.predict_proba(Xte)[:, 1]
        r = {
            "model_name": name,
            "accuracy": accuracy_score(yte, pred),
            "precision": precision_score(yte, pred),
            "recall": recall_score(yte, pred),  # Malignant recall
            "f1_score": f1_score(yte, pred),
            "roc_auc": roc_auc_score(yte, proba),
            "confusion_matrix": confusion_matrix(yte, pred).tolist(),  # [[TN,FP],[FN,TP]]
        }
        results.append(r); fitted[name] = pipe
        print(f"{name:22s} acc={r['accuracy']:.4f} prec={r['precision']:.4f} "
              f"rec={r['recall']:.4f} f1={r['f1_score']:.4f} auc={r['roc_auc']:.4f}")

    # Best = highest Malignant recall, then F1, then accuracy
    best = max(results, key=lambda r: (r["recall"], r["f1_score"], r["accuracy"]))
    print(f"\nBest model: {best['model_name']}")

    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    joblib.dump({"pipeline": fitted[best["model_name"]], "features": FEATURES,
                 "model_name": best["model_name"]}, out / "model.joblib")
    (out / "metrics.json").write_text(json.dumps(
        {"best_model": best["model_name"], "models": results}, indent=2))
    print(f"Saved to {out}/model.joblib and metrics.json")


if __name__ == "__main__":
    main()
