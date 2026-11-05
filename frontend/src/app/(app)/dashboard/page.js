"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ResultBadge from "@/components/ResultBadge";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { fmtDate, pct } from "@/lib/utils";

const Stat = ({ title, value }) => (
  <Card><CardHeader><CardDescription>{title}</CardDescription><CardTitle className="text-3xl">{value}</CardTitle></CardHeader></Card>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/predictions?limit=50").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!data) return <p className="text-muted-foreground">Loading...</p>;

  const malignant = data.items.filter((p) => p.predictedClass === "Malignant").length;
  const benign = data.items.length - malignant;
  const last = data.items[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <Button asChild><Link href="/analysis/new">New analysis</Link></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat title="Total analyses" value={data.total} />
        <Stat title="Benign results" value={benign} />
        <Stat title="Malignant results" value={malignant} />
      </div>
      {data.total > 50 && <p className="text-xs text-muted-foreground">Benign/Malignant counts cover your latest 50 analyses.</p>}
      <Card>
        <CardHeader><CardTitle>Latest analysis</CardTitle></CardHeader>
        <CardContent>
          {last ? (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <ResultBadge value={last.predictedClass} />
              <span>Probability: {pct(last.probability)}</span>
              <span className="text-muted-foreground">{fmtDate(last.createdAt)}</span>
              <Link className="text-primary underline" href={`/analysis/${last._id}`}>View</Link>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No analyses yet. Start with a new analysis.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
