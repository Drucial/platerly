import { format, formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

export function RelativeDate({ date }: { date: Date }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        {formatDistanceToNow(new Date(date), {
          addSuffix: true,
        })}
      </TooltipTrigger>
      <TooltipContent>{format(new Date(date), "MMMM d, yyyy")}</TooltipContent>
    </Tooltip>
  );
}
