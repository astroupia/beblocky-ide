"use client";

import { useAuthContext } from "@/components/context/auth-context";
import { useTheme } from "./context/theme-provider";
import { useCoin } from "./context/coin-context";
import { useSettings } from "./context/settings-context";
import { UserRole } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Coins, Moon, Settings, Sun } from "lucide-react";
import Logo from "@/public/assets/images/logo.png";

interface IdeHeaderProps {
  courseTitle?: string;
  userData?: {
    id: string;
    name: string;
    email: string;
    initials?: string;
    role?: UserRole;
  };
  onSettingsClick?: () => void;
}

export default function IdeHeader({
  courseTitle,
  userData,
  onSettingsClick,
}: IdeHeaderProps) {
  const { user } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const { coins } = useCoin();
  const { openSettings } = useSettings();

  // Check if user should see coins (only student roles)
  const shouldShowCoins = userData?.role === UserRole.STUDENT;

  // Determine navigation URL based on user role
  const getNavigationUrl = () => {
    const role = userData?.role;
    if (
      role === UserRole.ADMIN ||
      role === UserRole.TEACHER ||
      role === UserRole.ORGANIZATION
    ) {
      return "https://admin.beblocky.com";
    } else {
      return "https://code.beblocky.com";
    }
  };

  return (
    <header className="h-16 w-full border-b flex items-center justify-between px-4 transition-colors duration-200 bg-background">
      <div className="flex items-center gap-4">
        <a href={getNavigationUrl()} className="h-full flex items-center">
          <Image
            src={Logo}
            alt="Logo"
            width={100}
            height={100}
            // className="h-20 w-auto"
          />
        </a>
        {courseTitle && (
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-foreground">
              {courseTitle}
            </h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {shouldShowCoins && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 bg-amber-100 text-amber-900 dark:bg-amber-900/20 dark:text-amber-300 px-3 py-1 rounded-full">
                  <span className="font-medium">{coins.toFixed(0)}</span>
                  <Coins size={16} className="text-amber-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your learning coins</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick || openSettings}
          className="rounded-full"
        >
          <Settings className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          className="ml-2 rounded-full font-medium flex items-center gap-2"
        >
          {userData?.initials ? (
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              {userData.initials}
            </div>
          ) : null}
          {userData?.name || user?.displayName || "User"}
        </Button>
      </div>
    </header>
  );
}
