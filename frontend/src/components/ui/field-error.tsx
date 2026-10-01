import * as React from "react";
import { cn } from "cn";

function FieldError({
  className,
  error,
  ...props
}: React.ComponentProps<"p"> & { error?: string }) {
  if (!error) {
    return null;
  }

  return (
    <p className={cn("text-[0.8rem] font-medium text-destructive", className)} {...props}>
      {error}
    </p>
  );
}

export { FieldError };
