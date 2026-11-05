import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const steps = [
  ["1. Register", "Create a free account in seconds."],
  ["2. Enter measurements", "Provide nine cell measurements (each from 1 to 10)."],
  ["3. Get a prediction", "A trained ML model classifies the case as Benign or Malignant."],
];

export default function Landing() {
  return (
    <div className="space-y-12">
      <section className="py-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          AI-Powered <span className="text-primary">Breast Cancer</span> Classification
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          BreastCare AI compares five Machine Learning algorithms on the Breast Cancer Wisconsin dataset
          and uses the best one to classify cases as Benign or Malignant.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg"><Link href="/register">Get started</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/about">About the project</Link></Button>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {steps.map(([t, d]) => (
          <Card key={t}>
            <CardHeader><CardTitle>{t}</CardTitle><CardDescription>{d}</CardDescription></CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
