import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));
export const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "-");
export const pct = (n) => (typeof n === "number" ? `${(n * 100).toFixed(1)}%` : "-");
