import {
  Wrench,
  Gauge,
  Cog,
  Activity,
  Snowflake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  wrench: Wrench,
  gauge: Gauge,
  cog: Cog,
  activity: Activity,
  snowflake: Snowflake,
  "shield-check": ShieldCheck,
};

export default function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] || Wrench;
  return <Icon className={className} />;
}
