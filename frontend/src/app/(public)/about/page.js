import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const algos = ["K-Nearest Neighbors", "Decision Tree", "Random Forest", "Neural Network (MLP)", "Support Vector Machine"];

export default function About() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About the project</h1>
      <Card>
        <CardHeader><CardTitle>Dataset</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Breast Cancer Wisconsin (Original) from the UCI Machine Learning Repository: 699 records,
          9 numerical features, and two classes (Benign and Malignant).
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Algorithms compared</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {algos.map((a) => <li key={a}>{a}</li>)}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            The best model is selected with special attention to Malignant-class Recall.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Technology</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Next.js, Tailwind CSS, shadcn/ui, Node.js + Express, MongoDB, and a Python FastAPI service running scikit-learn.
        </CardContent>
      </Card>
    </div>
  );
}
