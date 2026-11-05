import { DISCLAIMER } from "@/lib/features";

export default function Disclaimer() {
  return (
    <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
      <strong>Important:</strong> {DISCLAIMER}
    </p>
  );
}
