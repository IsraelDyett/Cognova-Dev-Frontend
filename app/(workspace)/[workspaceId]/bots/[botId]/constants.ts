import { FileText, Globe } from "lucide-react";

export const sourceTypes = [
  { type: "pdf", icon: FileText, label: "PDF" },
  { type: "website", icon: Globe, label: "Website" },
] as const;
