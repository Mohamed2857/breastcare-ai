"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ResultBadge from "@/components/ResultBadge";
import Disclaimer from "@/components/Disclaimer";
import { api } from "@/lib/api";
import { FEATURES } from "@/lib/features";
import { fmtDate, pct } from "@/lib/utils";

export default function AnalysisResult() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/predictions/${id}`).then((d) => setP(d.prediction)).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!p) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Prediction result</h1>
      <Card>
        <CardHeader>
          <CardDescription>{fmtDate(p.createdAt)}</CardDescription>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <ResultBadge value={p.predictedClass} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>Model confidence in this class: <strong>{pct(p.probability)}</strong></p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Input measurements</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.key} className="flex justify-between rounded-md bg-muted px-3 py-2">
              <span>{f.label}</span><strong>{p.features[f.key]}</strong>
            </div>
          ))}
        </CardContent>
      </Card>
      <Disclaimer />
      <div className="flex gap-2">
        <Button asChild><Link href="/analysis/new">New analysis</Link></Button>
        <Button asChild variant="outline"><Link href="/history">History</Link></Button>
      </div>
    </div>
  );
}
