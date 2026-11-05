"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Disclaimer from "@/components/Disclaimer";
import { api } from "@/lib/api";
import { FEATURES } from "@/lib/features";

export default function NewAnalysis() {
  const router = useRouter();
  const [values, setValues] = useState(Object.fromEntries(FEATURES.map((f) => [f.key, ""])));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const body = {};
    for (const f of FEATURES) {
      const n = Number(values[f.key]);
      if (values[f.key] === "" || !Number.isInteger(n) || n < 1 || n > 10) {
        return setError(`"${f.label}" must be a whole number from 1 to 10.`);
      }
      body[f.key] = n;
    }
    setBusy(true);
    try {
      const { prediction } = await api("/predictions", { method: "POST", body });
      router.push(`/analysis/${prediction._id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New analysis</h1>
      <Card>
        <CardHeader>
          <CardTitle>Cell measurements</CardTitle>
          <CardDescription>Enter each value as a whole number from 1 to 10.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <Input id={f.key} type="number" min={1} max={10} step={1} required
                    value={values[f.key]} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy}>{busy ? "Analyzing..." : "Analyze"}</Button>
          </form>
        </CardContent>
      </Card>
      <Disclaimer />
    </div>
  );
}
