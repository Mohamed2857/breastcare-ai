"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ResultBadge from "@/components/ResultBadge";
import Pager from "@/components/Pager";
import { api } from "@/lib/api";
import { fmtDate, pct } from "@/lib/utils";

export default function AdminPredictions() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/admin/predictions?page=${page}&limit=15`).then(setData).catch((e) => setError(e.message));
  }, [page]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!data) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All predictions ({data.total})</h1>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow>
              <TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Result</TableHead>
              <TableHead>Probability</TableHead><TableHead>Date</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {data.items.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.user?.name || "(deleted)"}</TableCell>
                  <TableCell>{p.user?.email || "-"}</TableCell>
                  <TableCell><ResultBadge value={p.predictedClass} /></TableCell>
                  <TableCell>{pct(p.probability)}</TableCell>
                  <TableCell>{fmtDate(p.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pager page={data.page} pages={data.pages} onChange={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}
