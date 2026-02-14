import { ToastProvider } from "@/shared/ui/toast";
import { AuthInitializer } from "@/features/auth/ui/AuthInitializer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthInitializer />
      {children}
    </ToastProvider>
  );
}
