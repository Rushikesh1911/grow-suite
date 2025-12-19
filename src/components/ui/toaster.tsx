import { Check, X } from "lucide-react"
import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast-primitive"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant }) => {
        return (
          <Toast
            key={id}
            className="mb-2 flex items-start gap-3 p-4 pr-8"
            variant={variant}
          >
            <div className="mt-0.5">
              {variant === "destructive" ? (
                <X className="h-5 w-5 text-destructive-foreground" />
              ) : (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="grid gap-1 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose onClick={() => dismiss(id)} className="absolute right-1.5 top-1.5" />
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
