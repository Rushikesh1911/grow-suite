import { cn } from "@/lib/utils";

interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function GridBackground({ className, ...props }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 bg-white dark:bg-gray-950",
        "bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]",
        "bg-[size:24px_24px]",
        className
      )}
      {...props}
    />
  );
}
