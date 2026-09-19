import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { shareOrCopy, type SharePayload } from "@/lib/share";

export type ShareButtonVariant = "default" | "ghost" | "primary";

export interface ShareButtonProps extends SharePayload {
  variant?: ShareButtonVariant;
  label?: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

const variantMap: Record<
  ShareButtonVariant,
  "default" | "ghost" | "secondary"
> = {
  default: "secondary",
  ghost: "ghost",
  primary: "default",
};

export function ShareButton({
  title,
  text,
  url,
  variant = "default",
  label = "Share",
  className,
  size = "default",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare(): Promise<void> {
    const result = await shareOrCopy({ title, text, url });
    if (result === "copied") {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <Button
      type="button"
      variant={variantMap[variant]}
      size={size}
      onClick={handleShare}
      className={cn(
        variant === "primary" && "bg-primary text-primary-foreground",
        className,
      )}
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check aria-hidden />
          Copied!
        </>
      ) : (
        <>
          <Share2 aria-hidden />
          {label}
        </>
      )}
    </Button>
  );
}

export default ShareButton;
