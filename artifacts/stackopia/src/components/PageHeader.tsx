import { cn } from "@workspace/stackopia-ds/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
        <span className="w-[7px] h-[7px] rounded-full bg-primary flex-none" aria-hidden="true" />
        {eyebrow}
      </span>
      <h1 className="mt-2 text-3xl md:text-4xl font-serif font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-muted-foreground text-sm max-w-[52ch]">{description}</p>
      )}
    </div>
  );
}
