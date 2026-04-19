import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="mt-2 text-sm text-muted">{description}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-display text-5xl tracking-[0.08em] text-white">{value}</p>
      </CardContent>
    </Card>
  );
}
