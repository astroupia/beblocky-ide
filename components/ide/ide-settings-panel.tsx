"use client"

import { useState, useEffect } from "react"
import { useSettings } from "./context/settings-context"
import { useTheme } from "./context/theme-provider"
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Monitor, Keyboard, Palette } from "lucide-react"

export default function IdeSettingsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { settings, updateSettings } = useSettings()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("appearance")

  // Clone settings for local state
  const [localSettings, setLocalSettings] = useState({ ...settings })

  // Update local settings when the settings context changes
  useEffect(() => {
    // Force a re-render when isOpen changes
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    setLocalSettings({ ...settings })
  }, [settings])

  const handleSave = () => {
    updateSettings(localSettings)
    onClose()
  }

  const handleCancel = () => {
    setLocalSettings({ ...settings })
    onClose()
  }

  if (!isOpen) return null

  const editorThemes = [
    { value: "dracula", label: "Dracula" },
    { value: "monokai", label: "Monokai" },
    { value: "github", label: "GitHub" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "twilight", label: "Twilight" },
    { value: "xcode", label: "XCode" },
    { value: "chrome", label: "Chrome" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Settings</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X size={18} />
            </Button>
          </div>
        </CardHeader>

        <div className="flex-1 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="appearance"
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                >
                  <Palette size={16} />
                  <span>Appearance</span>
                </TabsTrigger>
                <TabsTrigger
                  value="editor"
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                >
                  <Monitor size={16} />
                  <span>Editor</span>
                </TabsTrigger>
                <TabsTrigger
                  value="keyboard"
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                >
                  <Keyboard size={16} />
                  <span>Keyboard</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="appearance" className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("light")}
                  >
                    <div className="w-4 h-4 rounded-full bg-white border mr-2"></div>
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("dark")}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-900 border mr-2"></div>
                    Dark
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Editor Theme</Label>
                <Select
                  value={localSettings.editorTheme}
                  onValueChange={(value) => setLocalSettings({ ...localSettings, editorTheme: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {editorThemes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="editor" className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fontSize">Font Size: {localSettings.fontSize}px</Label>
                  <span className="text-sm text-muted-foreground">{localSettings.fontSize}px</span>
                </div>
                <Slider
                  id="fontSize"
                  min={10}
                  max={24}
                  step={1}
                  value={[localSettings.fontSize]}
                  onValueChange={(value) => setLocalSettings({ ...localSettings, fontSize: value[0] })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSave">Auto Save</Label>
                  <Switch
                    id="autoSave"
                    checked={localSettings.autoSave}
                    onCheckedChange={(checked) => setLocalSettings({ ...localSettings, autoSave: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Automatically save your code changes as you type</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="wordWrap">Word Wrap</Label>
                  <Switch
                    id="wordWrap"
                    checked={localSettings.wordWrap}
                    onCheckedChange={(checked) => setLocalSettings({ ...localSettings, wordWrap: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Wrap long lines to fit within the editor</p>
              </div>
            </TabsContent>

            <TabsContent value="keyboard" className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboardShortcuts">Enable Keyboard Shortcuts</Label>
                  <Switch
                    id="keyboardShortcuts"
                    checked={localSettings.keyboardShortcuts}
                    onCheckedChange={(checked) => setLocalSettings({ ...localSettings, keyboardShortcuts: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Common Shortcuts</Label>
                <div className="bg-muted rounded-md p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Run Code</span>
                    <kbd className="px-2 py-0.5 bg-background rounded border">Ctrl + Enter</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Save</span>
                    <kbd className="px-2 py-0.5 bg-background rounded border">Ctrl + S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Format Code</span>
                    <kbd className="px-2 py-0.5 bg-background rounded border">Shift + Alt + F</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle Comment</span>
                    <kbd className="px-2 py-0.5 bg-background rounded border">Ctrl + /</kbd>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <CardFooter className="border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
