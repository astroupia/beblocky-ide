"use client";

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
  const handleDownload = async () => {
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
      toast({
        title: "Download Failed",
        description: "Failed to create download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle save with toast notifications
  const handleSave = async () => {
    try {
      await onSaveCode();
      toast({
        title: "Code Saved",
        description: "Your code has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-1"
            >
              <Save size={16} />
              <span>Save</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save your code (Ctrl+S)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="gap-1"
            >
              <Download size={16} />
              <span>Download</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download your code as HTML, CSS, and JavaScript files</p>
          </TooltipContent>
        </Tooltip>

        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showAiAssistant ? "default" : "outline"}
                size="sm"
                onClick={onToggleAiAssistant}
                className="gap-1"
              >
                <Bot size={16} />
                <span>AI Assistant</span>
              </Button>
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
    </div>
  );
}
