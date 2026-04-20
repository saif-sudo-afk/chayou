import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-gold">Admin Panel</p>
        <h1 className="font-display text-5xl tracking-[0.08em] text-brand">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
