"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Globe, FileText, AlignLeft, FileQuestion } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SourceIcon {
  className?: string;
}

interface DialogProps {
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
}

interface Source {
  key: string;
  label: string;
  icon: React.ComponentType<SourceIcon>;
  isAvailable: boolean;
  requiresPlan: boolean;
  dialogContent: () => Promise<React.ComponentType<DialogProps>>;
}

const sourceTypes: Source[] = [
  {
    key: "website",
    label: "Website",
    icon: Globe,
    isAvailable: true,
    requiresPlan: false,
    dialogContent: () => import("./add-sources").then((mod) => mod.WebContent),
  },
  {
    key: "pdf",
    label: ".pdf",
    icon: FileText,
    isAvailable: true,
    requiresPlan: false,
    dialogContent: () => import("./add-sources").then((mod) => mod.PDFUpload),
  },
  {
    key: "txt",
    label: ".txt",
    icon: FileText,
    isAvailable: true,
    requiresPlan: false,
    dialogContent: () => import("./add-sources").then((mod) => mod.TxtUpload),
  },
  {
    key: "text",
    label: "Text",
    icon: AlignLeft,
    isAvailable: true,
    requiresPlan: false,
    dialogContent: () => import("./add-sources").then((mod) => mod.TextInput),
  },
  {
    key: "faq",
    label: "FAQ",
    icon: FileQuestion,
    isAvailable: true,
    requiresPlan: false,
    dialogContent: () => import("./add-sources").then((mod) => mod.FAQInput),
  },
  {
    key: "sitemap",
    label: "Sitemap",
    icon: ({ className }) => (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" />
        <path d="M3 8H21" />
        <path d="M9 3V21" />
      </svg>
    ),
    isAvailable: true,
    requiresPlan: true,
    dialogContent: () => import("./add-sources").then((mod) => mod.AddSitemap),
  },
  {
    key: "sheets",
    label: "Sheets",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M19.5 3H4.5C3.67157 3 3 3.67157 3 4.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V4.5C21 3.67157 20.3284 3 19.5 3Z" />
        <path fill="none" stroke="white" strokeWidth="2" d="M7 8H17M7 12H17M7 16H13" />
      </svg>
    ),
    isAvailable: true,
    requiresPlan: true,
    dialogContent: () => import("./add-sources").then((mod) => mod.AddSheets),
  },
  {
    key: "docs",
    label: "Docs",
    icon: ({ className }) => (
      <svg viewBox="0 0 24 24" className={className} fill="#4285F4">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
        <path fill="#F1F1F1" d="M14 2V8H20L14 2Z" />
      </svg>
    ),
    isAvailable: true,
    requiresPlan: true,
    dialogContent: () => import("./add-sources").then((mod) => mod.GoogleDocs),
  },
];

const SourcesPageHeader: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedSource, setSelectedSource] = React.useState<Source | null>(null);
  const [LoadedComponent, setLoadedComponent] =
    React.useState<React.ComponentType<DialogProps> | null>(null);

  const handleSourceClick = async (source: Source) => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        const Component = await source.dialogContent();
        setLoadedComponent(() => Component);
        setSelectedSource(source);
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to load component:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open);
      if (!open) {
        // Delay to hide dialog first then content next
        setTimeout(() => {
          if (!open) {
            setSelectedSource(null);
            setLoadedComponent(null);
          }
        }, 100);
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Train your bot with knowledge.
      </h1>
      <p className="text-muted-foreground mb-8">Choose a source of data to add to your bot:</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {sourceTypes.map((source) => {
          const Icon = source.icon;
          return (
            <Button
              key={source.key}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center justify-center gap-2"
              onClick={() => handleSourceClick(source)}
              disabled={!source.isAvailable || isLoading}
            >
              <Icon className="h-8 w-8" />
              <span className="text-sm">{source.label}</span>
            </Button>
          );
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="text-start">
            <DialogTitle>{selectedSource?.label}</DialogTitle>
          </DialogHeader>
          {LoadedComponent && <LoadedComponent setIsLoading={setIsLoading} isLoading={isLoading} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SourcesPageHeader;
