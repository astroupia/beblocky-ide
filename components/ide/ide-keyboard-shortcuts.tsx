"use client";

import { useEffect } from "react";
import { useSettings } from "./context/settings-context";

type ShortcutHandler = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
  preventDefault?: boolean;
};

export default function IdeKeyboardShortcuts({
  onRunCode,
  onSaveCode,
  onFormatCode,
}: {
  onRunCode: () => void;
  onSaveCode: () => void;
  onFormatCode?: () => void;
}) {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.keyboardShortcuts) return;

    const shortcuts: ShortcutHandler[] = [
      // Run code: Ctrl+Enter
      {
        key: "Enter",
        ctrlKey: true,
        handler: onRunCode,
        preventDefault: true,
      },
      // Save code: Ctrl+S
      {
        key: "s",
        ctrlKey: true,
        handler: onSaveCode,
        preventDefault: true,
      },
    ];

    // Only add format shortcut if handler is provided
    if (onFormatCode) {
      shortcuts.push({
        key: "f",
        shiftKey: true,
        altKey: true,
        handler: onFormatCode,
        preventDefault: true,
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (shortcut.ctrlKey === undefined || e.ctrlKey === shortcut.ctrlKey) &&
          (shortcut.shiftKey === undefined ||
            e.shiftKey === shortcut.shiftKey) &&
          (shortcut.altKey === undefined || e.altKey === shortcut.altKey)
        ) {
          if (shortcut.preventDefault) {
            e.preventDefault();
          }
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [settings.keyboardShortcuts, onRunCode, onSaveCode, onFormatCode]);

  return null;
}
