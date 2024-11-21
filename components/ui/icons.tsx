import { cn } from "@/lib/utils";

export const Icons = {
  IconSpinner: ({ className, ...props }: React.ComponentProps<"svg">) => {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("size-4 animate-spin text-white", className)}
        {...props}
      >
        <circle
          strokeWidth={4}
          stroke="currentColor"
          r="10"
          cy="12"
          cx="12"
          className="opacity-25"
        />
        <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" className="opacity-75" />
      </svg>
    );
  },
};
