import { Button } from "../ui/button";

type AdminHeaderProps = {
  title: string;
  description: string;
  onAdd: () => void;
};

export function AdminHeader({ title, description, onAdd }: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-none">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAdd}>Add</Button>
      </div>
    </div>
  );
}
