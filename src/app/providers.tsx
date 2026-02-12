import { ToastProvider } from "@/shared/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
