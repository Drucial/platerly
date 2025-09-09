"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllImages } from "@/hooks/image/use-get-all-images";

type ImageSelectProps = {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ImageSelect({
  value,
  onValueChange,
  disabled,
  placeholder = "Select image",
}: ImageSelectProps) {
  const { data: imagesData, isLoading } = useGetAllImages();

  return (
    <Select onValueChange={onValueChange} value={value} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            Loading images...
          </div>
        ) : imagesData?.images && imagesData.images.length > 0 ? (
          imagesData.images.map((image) => (
            <SelectItem key={image.id} value={image.id.toString()}>
              {image.name}
            </SelectItem>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No images available
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
