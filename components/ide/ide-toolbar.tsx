"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  Save,
  FileCode,
  Download,
  Settings,
  LayoutTemplate,
  LayoutGrid,
  Maximize,
  LayoutList,
  Check,
  Bot,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettings } from "./context/settings-context";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/ui/loading-button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function IdeToolbar({
  onRunCode,
  onSaveCode,
  mainCode,
  onChangeLayout,
  currentLayout,
  onToggleAiAssistant,
  showAiAssistant,
}: {
  onRunCode: () => void;
  onSaveCode: () => Promise<void>;
  mainCode: string;
  onChangeLayout: (layout: string) => void;
  currentLayout: string;
  onToggleAiAssistant: () => void;
  showAiAssistant: boolean;
}) {
  const { openSettings } = useSettings();
  const { toast } = useToast();

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAiAssistantLoading, setIsAiAssistantLoading] = useState(false);

  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [aiAssistantDialogOpen, setAiAssistantDialogOpen] = useState(false);

  // Function to extract HTML, CSS, and JavaScript from the main code
  const extractCodeParts = (code: string) => {
    const htmlMatch = code.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
    const headMatch = code.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const bodyMatch = code.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

    let html = "";
    let css = "";
    let js = "";

    // Extract HTML content
    if (htmlMatch) {
      html = htmlMatch[1];
    } else if (headMatch && bodyMatch) {
      html = headMatch[1] + "\n" + bodyMatch[1];
    } else if (bodyMatch) {
      html = bodyMatch[1];
    }

    // Extract CSS
    if (styleMatch) {
      css = styleMatch[1];
    }

    // Extract JavaScript
    if (scriptMatch) {
      js = scriptMatch[1];
    }

    return { html, css, js };
  };

  // Function to download code as zip file
  const performDownload = async () => {
    setIsDownloading(true);
    try {
      // Import JSZip dynamically to avoid SSR issues
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const { html, css, js } = extractCodeParts(mainCode);

      // Create HTML file
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${html}
<script src="script.js"></script>
</body>
</html>`;

      // Add files to zip
      zip.file("index.html", htmlContent);
      zip.file("styles.css", css);
      zip.file("script.js", js);

      // Generate and download zip file
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-project.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Successful",
        description: "Your project files have been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error creating zip file:", error);
      setErrorMessage("Failed to create download file. Please try again.");
      setErrorDialogOpen(true);
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to show download confirmation dialog
  const showDownloadConfirmation = () => {
    setDownloadDialogOpen(true);
  };

  // Function to show AI Assistant confirmation dialog
  const showAiAssistantConfirmation = () => {
    setAiAssistantDialogOpen(true);
  };

  // Function to handle save with loading state and error handling
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveCode();
      toast({
        title: "Code Saved",
        description: "Your code has been saved successfully.",
      });
    } catch (error) {
      setErrorMessage("Failed to save your code. Please try again.");
      setErrorDialogOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to show save confirmation dialog
  const showSaveConfirmation = () => {
    setSaveDialogOpen(true);
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={showSaveConfirmation}
              loading={isSaving}
              loadingText="Saving..."
              className="gap-1"
            >
              <Save size={16} />
              <span>Save</span>
            </LoadingButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save your code (Ctrl+S)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={showDownloadConfirmation}
              loading={isDownloading}
              loadingText="Downloading..."
              className="gap-1"
            >
              <Download size={16} />
              <span>Download</span>
            </LoadingButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download your code as HTML, CSS, and JavaScript files</p>
          </TooltipContent>
        </Tooltip>

        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <LoadingButton
                variant={showAiAssistant ? "default" : "outline"}
                size="sm"
                onClick={showAiAssistantConfirmation}
                loading={isAiAssistantLoading}
                loadingText={showAiAssistant ? "Disabling..." : "Enabling..."}
                className="gap-1"
              >
                <Bot size={16} />
                <span>AI Assistant</span>
              </LoadingButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle AI Assistant</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <LayoutTemplate size={16} />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change layout</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => onChangeLayout("standard")}
              >
                <LayoutGrid size={16} />
                <span>Standard Layout</span>
                {currentLayout === "standard" && (
                  <Check size={16} className="ml-auto text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => onChangeLayout("focus")}
              >
                <Maximize size={16} />
                <span>Focus Mode</span>
                {currentLayout === "focus" && (
                  <Check size={16} className="ml-auto text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => onChangeLayout("split")}
              >
                <LayoutList size={16} />
                <span>Split View</span>
                {currentLayout === "split" && (
                  <Check size={16} className="ml-auto text-green-500" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>

      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        type="confirm"
        title="Save Code"
        description="Are you sure you want to save your current code? This will update your progress."
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={handleSave}
        loading={isSaving}
      />

      {/* Download Confirmation Dialog */}
      <ConfirmationDialog
        open={downloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
        type="info"
        title="Download Project"
        description="Your project will be downloaded as a ZIP file containing HTML, CSS, and JavaScript files."
        confirmText="Download"
        onConfirm={performDownload}
        loading={isDownloading}
      />

      {/* AI Assistant Confirmation Dialog */}
      <ConfirmationDialog
        open={aiAssistantDialogOpen}
        onOpenChange={setAiAssistantDialogOpen}
        type="info"
        title={showAiAssistant ? "Disable AI Assistant" : "Enable AI Assistant"}
        description={
          showAiAssistant
            ? "Are you sure you want to disable the AI Assistant? You'll lose access to AI-powered code suggestions and help."
            : "Enable the AI Assistant to get intelligent code suggestions, explanations, and help with your coding tasks."
        }
        confirmText={showAiAssistant ? "Disable" : "Enable"}
        cancelText="Cancel"
        onConfirm={async () => {
          setIsAiAssistantLoading(true);
          try {
            await onToggleAiAssistant();
          } finally {
            setIsAiAssistantLoading(false);
          }
        }}
        loading={isAiAssistantLoading}
      />

      {/* Error Dialog */}
      <ConfirmationDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        type="error"
        title="Error"
        description={errorMessage}
        confirmText="OK"
      />
    </div>
  );
}
