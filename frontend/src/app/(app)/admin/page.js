"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ResultBadge from "@/components/ResultBadge";
import { api } from "@/lib/api";
import { fmtDate, pct } from "@/lib/utils";

const Stat = ({ title, value }) => (
  <Card><CardHeader><CardDescription>{title}</CardDescription><CardTitle className="text-3xl">{value}</CardTitle></CardHeader></Card>
);

export default function AdminDashboard() {
  const [d, setD] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/dashboard").then(setD).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!d) return <p className="text-muted-foreground">Loading...</p>;

  const pie = [
    { name: "Benign", value: d.benignPredictions, color: "#10b981" },
    { name: "Malignant", value: d.malignantPredictions, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat title="Total users" value={d.totalUsers} />
        <Stat title="Active users" value={d.activeUsers} />
        <Stat title="Total predictions" value={d.totalPredictions} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Predictions by class</CardTitle></CardHeader>
          <CardContent className="h-64">
            {d.totalPredictions === 0 ? (
              <p className="text-sm text-muted-foreground">No predictions yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" outerRadius={80} label>
                    {pie.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent predictions</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Result</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {d.recentPredictions.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.user?.name || "(deleted)"}</TableCell>
                    <TableCell><ResultBadge value={p.predictedClass} /></TableCell>
                    <TableCell>{fmtDate(p.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
