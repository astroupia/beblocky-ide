"use client";

import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Code2,
  FileText,
  Maximize2,
  Minimize2,
  Play,
  Terminal,
  Sparkles,
  Eye,
  Hash,
  Quote,
  List,
  Link,
  ImageIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export default function IdeMarkdownPreview({
  content,
  className,
}: MarkdownPreviewProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [codeBlocks, setCodeBlocks] = useState<
    Array<{ code: string; language: string; filename?: string }>
  >([]);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const convertMarkdownToHtml = async () => {
      setIsLoading(true);
      try {
        const { marked } = await import("marked");
        const { markedHighlight } = await import("marked-highlight");
        const hljs = (await import("highlight.js")).default;

        // Store code blocks for custom rendering
        const blocks: Array<{
          code: string;
          language: string;
          filename?: string;
        }> = [];

        marked.setOptions({ breaks: true, gfm: true });
        marked.use(
          markedHighlight({
            langPrefix: "hljs language-",
            highlight(code: string, lang: string) {
              // Store the code block for custom rendering
              const blockIndex = blocks.length;
              blocks.push({
                code: code,
                language: lang || "text",
                filename: extractFilename(code, lang),
              });

              if (lang && hljs.getLanguage(lang)) {
                const highlighted = hljs.highlight(code, {
                  language: lang,
                }).value;
                return `<div data-code-block="${blockIndex}">${highlighted}</div>`;
              }
              const highlighted = hljs.highlightAuto(code).value;
              return `<div data-code-block="${blockIndex}">${highlighted}</div>`;
            },
          })
        );

        const html = marked.parse(content || "") as string;
        setCodeBlocks(blocks);
        setHtmlContent(html);
      } catch (error) {
        console.error("Error converting markdown:", error);
        setHtmlContent(
          `<pre class="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">${(
            content || ""
          )
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</pre>`
        );
      } finally {
        setIsLoading(false);
      }
    };

    convertMarkdownToHtml();
  }, [content]);

  // Add copy-link buttons to headings after content is set
  useEffect(() => {
    if (!contentRef.current) return;
    const root = contentRef.current;
    const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");

    headings.forEach((h) => {
      const heading = h as HTMLElement;
      // Avoid duplicate buttons
      if (heading.querySelector('[data-heading-copy="true"]')) return;

      // Ensure ID exists
      if (!heading.id) {
        const slug = heading.textContent
          ?.toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 64);
        if (slug) heading.id = slug;
      }

      const btn = document.createElement("button");
      btn.setAttribute("type", "button");
      btn.setAttribute("data-heading-copy", "true");
      btn.className =
        "ml-2 inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80";
      btn.title = "Copy link";
      btn.textContent = "#";
      btn.onclick = () => {
        const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;
        navigator.clipboard.writeText(url).catch(() => {});
      };
      heading.classList.add("group");
      heading.appendChild(btn);
    });
  }, [htmlContent]);

  const extractFilename = (code: string, lang: string): string | undefined => {
    // Try to extract filename from first line if it looks like a comment
    const firstLine = code.split("\n")[0]?.trim();
    if (
      firstLine?.startsWith("//") ||
      firstLine?.startsWith("#") ||
      firstLine?.startsWith("/*")
    ) {
      const match = firstLine.match(/(?:file:|filename:)\s*([^\s]+)/i);
      if (match) return match[1];
    }
    return undefined;
  };

  const renderCustomContent = (html: string) => {
    // Replace code blocks with custom components
    return html.replace(
      /<pre><code[^>]*><div data-code-block="(\d+)">([\s\S]*?)<\/div><\/code><\/pre>/g,
      (match, blockIndex) => {
        const index = Number.parseInt(blockIndex);
        const block = codeBlocks[index];
        if (!block) return match;

        return `<div data-custom-code-block="${index}"></div>`;
      }
    );
  };

  const getContentTypeIcon = (content: string) => {
    if (content.includes("```")) return Code2;
    if (content.includes("#")) return Hash;
    if (content.includes(">")) return Quote;
    if (content.includes("-") || content.includes("*")) return List;
    if (content.includes("[") && content.includes("](")) return Link;
    if (content.includes("![")) return ImageIcon;
    return FileText;
  };

  const ContentIcon = getContentTypeIcon(content);

  if (isLoading) {
    return (
      <div className={cn("h-full overflow-hidden", className)}>
        <Card className="h-full bg-gradient-to-br from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
            <span className="ml-3 text-muted-foreground">
              Rendering markdown...
            </span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn("h-full overflow-hidden", className)}>
        <Card className="h-full bg-gradient-to-br from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-2 border-b border-border/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <ContentIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Preview
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Live markdown rendering
                  </p>
                </div>
              </div>
            </div>

            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
              <Eye className="h-3 w-3 mr-1" />
              <Sparkles className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </motion.div>

          {/* Content */}
          <ScrollArea className="h-[calc(100%-80px)] w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-4 w-full"
            >
              <div
                ref={contentRef}
                className="prose prose-slate dark:prose-invert max-w-none 
                  prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:tracking-tight
                  prose-h1:text-3xl prose-h1:font-bold prose-h1:bg-gradient-to-r prose-h1:from-slate-900 prose-h1:to-slate-600 prose-h1:bg-clip-text prose-h1:text-transparent dark:prose-h1:from-white dark:prose-h1:to-slate-300
                  prose-h2:text-2xl prose-h2:font-semibold prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2
                  prose-h3:text-xl prose-h3:font-medium
                  prose-p:leading-7 prose-p:text-slate-700 dark:prose-p:text-slate-300
                  prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4
                  prose-ul:my-6 prose-li:my-2
                  prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
                  prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
                  prose-table:border-collapse prose-table:border prose-table:border-border/50 prose-table:rounded-lg prose-table:overflow-hidden
                  prose-th:bg-slate-50 dark:prose-th:bg-slate-800 prose-th:border prose-th:border-border/50 prose-th:px-4 prose-th:py-2 prose-th:font-semibold
                  prose-td:border prose-td:border-border/50 prose-td:px-4 prose-td:py-2 w-full"
                dangerouslySetInnerHTML={{
                  __html: renderCustomContent(htmlContent),
                }}
              />
            </motion.div>
          </ScrollArea>
        </Card>
      </div>
    </TooltipProvider>
  );
}
