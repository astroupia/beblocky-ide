"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function IdeLoadingSkeleton() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Header Skeleton */}
      <div className="h-16 w-full border-b flex items-center justify-between px-4 bg-background">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" /> {/* Logo */}
          <Skeleton className="h-6 w-48 hidden md:block" /> {/* Course title */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-full" /> {/* Coins */}
          <Skeleton className="h-10 w-10 rounded-full" /> {/* Theme toggle */}
          <Skeleton className="h-10 w-10 rounded-full" /> {/* Settings */}
          <Skeleton className="h-10 w-20 rounded-full" /> {/* User menu */}
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
        <Skeleton className="h-8 w-16" /> {/* Run button */}
        <Skeleton className="h-8 w-16" /> {/* Save button */}
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-8 w-8" /> {/* File operations */}
          <Skeleton className="h-8 w-8" /> {/* Layout */}
          <Skeleton className="h-8 w-8" /> {/* Settings */}
        </div>
      </div>

      {/* Main Workspace Skeleton */}
      <div className="flex-1 overflow-hidden flex">
        {/* Slides Panel */}
        <div className="w-1/4 border-r">
          <Card className="h-full border-none rounded-none shadow-none">
            <CardHeader className="p-2 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" /> {/* Menu button */}
                  <Skeleton className="h-4 w-32" /> {/* Title */}
                </div>
                <Skeleton className="h-4 w-16" /> {/* Slide counter */}
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" /> {/* Slide title */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-32 w-full rounded-md" />{" "}
              {/* Image placeholder */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor Panel */}
        <div className="w-2/5 border-r">
          <Card className="h-full border-none rounded-none shadow-none">
            <CardHeader className="p-2 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" /> {/* Editor title */}
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-12" /> {/* HTML tab */}
                  <Skeleton className="h-6 w-12" /> {/* CSS tab */}
                  <Skeleton className="h-6 w-16" /> {/* JS tab */}
                </div>
                <Skeleton className="h-8 w-8" /> {/* Layout toggle */}
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="h-full bg-muted/20 p-4 space-y-2">
                {/* Code lines skeleton */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-6 bg-muted" />{" "}
                    {/* Line number */}
                    <Skeleton
                      className={`h-4 bg-muted ${
                        i % 4 === 0
                          ? "w-3/4"
                          : i % 3 === 0
                          ? "w-1/2"
                          : i % 2 === 0
                          ? "w-5/6"
                          : "w-2/3"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="flex-1">
          <Card className="h-full border-none rounded-none shadow-none">
            <CardHeader className="p-2 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="w-3 h-3 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-16" /> {/* Preview title */}
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8" /> {/* Refresh */}
                  <Skeleton className="h-8 w-8" /> {/* Maximize */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 bg-card">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" /> {/* Page title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-24 w-full rounded-md" />{" "}
                {/* Content block */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="h-10 border-t bg-background flex items-center px-4 justify-end gap-4">
        <Skeleton className="h-6 w-20 rounded-full" /> {/* Console toggle */}
        <Skeleton className="h-6 w-24 rounded-full" />{" "}
        {/* AI Assistant toggle */}
      </div>
    </div>
  );
}
