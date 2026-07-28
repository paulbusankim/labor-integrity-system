import { CONFIG } from "@/config";

type LogLevel = "info" | "warn" | "error" | "debug";

export const logger = {
  info: (tag: string, message: string, data?: any) => {
    console.log(`ℹ️ [INFO][${tag}] ${message}`, data ? data : "");
  },
  warn: (tag: string, message: string, data?: any) => {
    console.warn(`⚠️ [WARN][${tag}] ${message}`, data ? data : "");
  },
  error: (tag: string, message: string, data?: any) => {
    console.error(`❌ [ERROR][${tag}] ${message}`, data ? data : "");
  },
  debug: (tag: string, message: string, data?: any) => {
    if (CONFIG.IS_DEV) {
      console.log(`🐛 [DEBUG][${tag}] ${message}`, data ? data : "");
    }
  },
};
