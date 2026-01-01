import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('w-full space-y-2', containerClassName)}>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-3.5 text-muted-foreground">
              {startIcon}
            </div>
          )}
          <textarea
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              startIcon ? 'pl-10' : 'pl-3',
              endIcon ? 'pr-10' : 'pr-3',
              error ? 'border-destructive' : 'border-input',
              className
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-3.5 text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
