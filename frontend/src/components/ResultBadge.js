import { Badge } from "@/components/ui/badge";

export default function ResultBadge({ value }) {
  return <Badge variant={value === "Malignant" ? "danger" : "success"}>{value}</Badge>;
}
