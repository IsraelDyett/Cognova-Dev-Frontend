interface DialogProps {
    isLoading?: boolean;
    setIsLoading?: (loading: boolean) => void;
}
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AddWebSource from './add-web-source';

export const ProAlert: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="space-y-4">
        <Alert>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    </div>
);

export const TextInput: React.FC<DialogProps> = ({ setIsLoading, isLoading }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add Direct Text</h3>
        <p className="text-muted-foreground">
            Paste or type text directly to train your bot.
        </p>
        {/* Add your text input implementation here */}
    </div>
);

export const PDFUpload: React.FC<DialogProps> = ({ setIsLoading, isLoading }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add PDF Document</h3>
        <p className="text-muted-foreground">
            Upload PDF files to train your bot with their content.
        </p>
        {/* Add your PDF upload implementation here */}
    </div>
);

export const TxtUpload: React.FC<DialogProps> = ({ setIsLoading, isLoading }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add Text File</h3>
        <p className="text-muted-foreground">
            Upload plain text files to train your bot.
        </p>
        {/* Add your text file upload implementation here */}
    </div>
);

export const FAQInput: React.FC<DialogProps> = ({ setIsLoading, isLoading }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add FAQ Content</h3>
        <p className="text-muted-foreground">
            Import frequently asked questions to train your bot with common queries and responses.
        </p>
        {/* Add your FAQ input implementation here */}
    </div>
);

export const WebContent: React.FC<DialogProps> = ({ setIsLoading, isLoading }) => (
    <div className="space-y-4">
        <div>
            <p className="text-muted-foreground">
                Import content from any public webpage to train your bot.
            </p>
        </div>
        <AddWebSource setIsLoading={setIsLoading} isLoading={isLoading} />
    </div>
);

export const AddSitemap: React.FC<DialogProps> = ({ setIsLoading, isLoading }) => (
    <ProAlert
        title="Pro Plan Required"
        description="Sitemap import is available on our Pro plan. Upgrade to access this feature."
    />
);
export const AddSheets: React.FC<DialogProps> = ({ setIsLoading, isLoading }) => (
    <ProAlert
        title="Pro Plan Required"
        description="Microsoft Excel Sheets integration is available on our Pro plan. Upgrade to access this feature."
    />
);
export const GoogleDocs: React.FC<DialogProps> = ({ setIsLoading, isLoading }) => (
    <ProAlert
        title="Pro Plan Required"
        description="Google Docs integration is available on our Pro plan. Upgrade to access this feature."
    />
);