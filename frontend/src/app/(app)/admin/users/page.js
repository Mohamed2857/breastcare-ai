"use client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pager from "@/components/Pager";
import { api } from "@/lib/api";
import { fmtDate } from "@/lib/utils";

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    const params = new URLSearchParams({ page, limit: 10 });
    if (search) params.set("q", search);
    api(`/admin/users?${params}`).then(setData).catch((e) => setError(e.message));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const act = async (fn) => {
    setError("");
    try { await fn(); load(); } catch (e) { setError(e.message); }
  };
  const toggle = (u) => act(() => api(`/admin/users/${u._id}`, { method: "PATCH", body: { isActive: !u.isActive } }));
  const remove = (u) => {
    if (window.confirm(`Delete ${u.name} and all their predictions? This cannot be undone.`))
      act(() => api(`/admin/users/${u._id}`, { method: "DELETE" }));
  };
  const saveEdit = async (e) => {
    e.preventDefault();
    const { _id, name, email, role } = editing;
    await act(() => api(`/admin/users/${_id}`, { method: "PATCH", body: { name, email, role } }));
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(q); }}>
        <Input placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <Button type="submit" variant="secondary">Search</Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Card>
        <CardContent className="pt-6">
          {!data ? <p className="text-muted-foreground">Loading...</p> : (
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead>
                <TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {data.items.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge></TableCell>
                    <TableCell><Badge variant={u.isActive ? "success" : "danger"}>{u.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell>{fmtDate(u.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => setEditing(u)}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => toggle(u)}>{u.isActive ? "Deactivate" : "Activate"}</Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(u)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {data && <Pager page={data.page} pages={data.pages} onChange={setPage} />}
        </CardContent>
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-md">
            <CardHeader><CardTitle>Edit user</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={saveEdit} className="space-y-4">
                <div className="space-y-2"><Label>Name</Label>
                  <Input required minLength={2} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label>
                  <Input type="email" required value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>Role</Label>
                  <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })}>
                    <option value="user">user</option><option value="admin">admin</option>
                  </select></div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
