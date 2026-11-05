"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ResultBadge from "@/components/ResultBadge";
import Pager from "@/components/Pager";
import { api } from "@/lib/api";
import { fmtDate, pct } from "@/lib/utils";

export default function History() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/predictions?page=${page}&limit=10`).then(setData).catch((e) => setError(e.message));
  }, [page]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!data) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analysis history</h1>
      <Card>
        <CardContent className="pt-6">
          {data.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No analyses yet.</p>
          ) : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Date</TableHead><TableHead>Result</TableHead><TableHead>Probability</TableHead><TableHead />
              </TableRow></TableHeader>
              <TableBody>
                {data.items.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{fmtDate(p.createdAt)}</TableCell>
                    <TableCell><ResultBadge value={p.predictedClass} /></TableCell>
                    <TableCell>{pct(p.probability)}</TableCell>
                    <TableCell><Link className="text-primary underline" href={`/analysis/${p._id}`}>View</Link></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Pager page={data.page} pages={data.pages} onChange={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}
