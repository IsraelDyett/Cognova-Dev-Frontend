"use client";

import React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { scraperApi, useScraperStore } from "./scraper-store";
import { useWorkspace } from "@/app/(workspace)/contexts/workspace-context";
import { useParams, useRouter } from "next/navigation";

interface ParentDialogProps {
  isLoading?: boolean;
  setIsLoading?: (open: boolean) => void;
}

const AddWebSource = ({ isLoading, setIsLoading }: ParentDialogProps) => {
  const { step, urls, selectedUrls, error, setStep, setUrls, setSelectedUrls, setError } =
    useScraperStore();

  const { botId } = useParams();
  const router = useRouter();
  const { workspace } = useWorkspace();
  const [directUrl, setDirectUrl] = React.useState("");

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleRetrievingUrls = async () => {
    setError(null);

    if (!validateUrl(directUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading?.(true);

    try {
      const data = await scraperApi.fetchUrls(directUrl);
      setUrls(data);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleUrlSelection = async () => {
    if (selectedUrls.length === 0) {
      setError("Please select at least one URL to scrape");
      return;
    }

    setError(null);
    setIsLoading?.(true);

    try {
      const response = await scraperApi.scrapeURLs(selectedUrls, workspace?.id, `${botId}`);
      if (response.status == "success") {
        toast.success("Website content added successfully");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleUrlToggle = (url: string, checked: boolean) => {
    setSelectedUrls(checked ? [...selectedUrls, url] : selectedUrls.filter((u) => u !== url));
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url-input">Enter URL</Label>
            <Input
              id="url-input"
              placeholder="https://example.com"
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={handleRetrievingUrls} disabled={isLoading || !directUrl.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {urls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`url-${index}`}
                  checked={selectedUrls.includes(url)}
                  onCheckedChange={(checked) => handleUrlToggle(url, checked as boolean)}
                />
                <Label
                  htmlFor={`url-${index}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {url}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
              Back
            </Button>
            <Button onClick={handleUrlSelection} disabled={isLoading || selectedUrls.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping
                </>
              ) : (
                "Start Scraping"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWebSource;
