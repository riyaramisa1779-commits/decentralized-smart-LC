import { cn } from "@/lib/utils";

export const Container = ({
  className,
  children,
  isFullWidth = false,
}: {
  className?: string;
  children: React.ReactNode;
  isFullWidth?: boolean;
}) => {
  return (
    <div
      id="page-container"
      className={cn("container max-w-6xl px-2 md:px-4 lg:px-4", isFullWidth && "max-w-full", className)}
    >
      {children}
    </div>
  );
};
