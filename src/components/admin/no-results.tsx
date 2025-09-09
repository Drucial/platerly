import { LucideIcon } from "lucide-react";

type NoResultsProps = {
  Icon: LucideIcon;
  title: string;
  description: string;
};

export function NoResults({ Icon, title, description }: NoResultsProps) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full py-10 px-4">
      <Icon className="w-10 h-10 text-muted-foreground" />
      <div className="text-center text-muted-foreground">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
