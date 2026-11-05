"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { pct } from "@/lib/utils";

export default function AdminModels() {
  const [models, setModels] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/models").then((d) => setModels(d.models)).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!models) return <p className="text-muted-foreground">Loading...</p>;
  if (models.length === 0)
    return <p className="text-muted-foreground">No model results yet. Run the ML training, then <code>npm run seed</code> in the backend.</p>;

  const chart = models.map((m) => ({
    name: m.modelName.replace("Neural Network (MLP)", "MLP"),
    Accuracy: +(m.accuracy * 100).toFixed(1),
    Precision: +(m.precision * 100).toFixed(1),
    Recall: +(m.recall * 100).toFixed(1),
    "F1-Score": +(m.f1Score * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Model comparison</h1>
      <Card>
        <CardHeader>
          <CardTitle>Metrics (%)</CardTitle>
          <CardDescription>Malignant is the positive class. Recall is the priority metric.</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis domain={[80, 100]} fontSize={12} />
              <Tooltip /><Legend />
              <Bar dataKey="Accuracy" fill="#6366f1" />
              <Bar dataKey="Precision" fill="#0ea5e9" />
              <Bar dataKey="Recall" fill="#ef4444" />
              <Bar dataKey="F1-Score" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Model</TableHead><TableHead>Accuracy</TableHead><TableHead>Precision</TableHead>
              <TableHead>Recall</TableHead><TableHead>F1-Score</TableHead><TableHead>ROC-AUC</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {models.map((m) => (
                <TableRow key={m._id}>
                  <TableCell className="font-medium">
                    {m.modelName} {m.isBest && <Badge className="ml-2">Selected</Badge>}
                  </TableCell>
                  <TableCell>{pct(m.accuracy)}</TableCell>
                  <TableCell>{pct(m.precision)}</TableCell>
                  <TableCell>{pct(m.recall)}</TableCell>
                  <TableCell>{pct(m.f1Score)}</TableCell>
                  <TableCell>{pct(m.rocAuc)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m) => {
          const [[tn, fp], [fn, tp]] = m.confusionMatrix;
          return (
            <Card key={m._id}>
              <CardHeader><CardTitle className="text-base">{m.modelName}</CardTitle>
                <CardDescription>Confusion matrix</CardDescription></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-1 text-center text-sm">
                  <div className="rounded bg-emerald-100 p-3"><div className="text-xs">True Benign</div><strong>{tn}</strong></div>
                  <div className="rounded bg-amber-100 p-3"><div className="text-xs">False Malignant</div><strong>{fp}</strong></div>
                  <div className="rounded bg-red-100 p-3"><div className="text-xs">Missed Malignant</div><strong>{fn}</strong></div>
                  <div className="rounded bg-emerald-100 p-3"><div className="text-xs">True Malignant</div><strong>{tp}</strong></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
