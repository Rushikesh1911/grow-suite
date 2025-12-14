import { cn } from "@/lib/utils";

interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function GridBackground({ className, ...props }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 bg-transparent",
        "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]",
        "bg-[size:32px_32px]",
        className
      )}
      {...props}
    />
  );
}
