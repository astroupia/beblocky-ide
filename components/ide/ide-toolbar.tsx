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
  Upload,
  Settings,
  LayoutTemplate,
  LayoutGrid,
  Maximize,
  LayoutList,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSettings } from "./context/settings-context";

export default function IdeToolbar({
  onRunCode,
  onSaveCode,
  // onFormatCode, // Removed
  onChangeLayout,
  currentLayout,
}: {
  onRunCode: () => void;
  onSaveCode: () => void;
  // onFormatCode: () => void; // Removed
  onChangeLayout: (layout: string) => void;
  currentLayout: string;
}) {
  const { openSettings } = useSettings();

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={onRunCode}
              className="gap-1"
            >
              <Play size={16} />
              <span>Run</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Run your code (Ctrl+Enter)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveCode}
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

        {/* Removed Format Button */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onFormatCode} className="gap-1">
              <Code size={16} />
              <span>Format</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Format your code (Shift+Alt+F)</p>
          </TooltipContent>
        </Tooltip> */}

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <FileCode size={16} />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>File operations</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2">
                <Download size={16} />
                <span>Download Code</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Upload size={16} />
                <span>Upload Code</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={openSettings}
                className="h-8 w-8"
              >
                <Settings size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
