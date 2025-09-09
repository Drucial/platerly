"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllUsers } from "@/hooks/user/use-get-all-users";

type UserSelectProps = {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

export function UserSelect({
  value,
  onValueChange,
  disabled,
}: UserSelectProps) {
  const { data: usersData, isLoading } = useGetAllUsers();

  // Don't render the Select until we have data, to avoid race condition
  if (isLoading) {
    return (
      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
        <span className="text-muted-foreground">Loading users...</span>
      </div>
    );
  }
  
  return (
    <Select onValueChange={onValueChange} value={value} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select user" />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            Loading users...
          </div>
        ) : usersData?.users && usersData.users.length > 0 ? (
          usersData.users.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.first_name} {user.last_name}
            </SelectItem>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No users available
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
