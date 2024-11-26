import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Control } from "react-hook-form";
import { UpdateUserType } from "../AccountValidation";

interface UpdateAvatarInputProps {
  control: Control<UpdateUserType>;
}

export default function UpdateAvatarInput({ control }: UpdateAvatarInputProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUpdating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUpdating]);

  const handleEditClick = () => {
    setIsUpdating(true);
    setIsFocused(true);
  };

  return (
    <>
      {isUpdating ? (
        <FormField
          control={control}
          name="avatar"
          render={({ field }) => (
            <FormItem
              className={cn(
                "relative mb-2 ml-6 flex w-full items-center rounded-md border border-gray-700 transition-all duration-300",
                {
                  "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                    isFocused,
                },
              )}
            >
              <FormLabel
                className={cn(
                  "absolute left-3 text-lg text-muted-foreground transition-all",
                  isFocused || field.value ? "top-1.5 text-sm" : "top-4",
                )}
              >
                Avatar URL
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={inputRef}
                  value={field.value.url}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="h-12 rounded-md border-none pt-5 text-base shadow-none focus-visible:ring-0"
                />
              </FormControl>
            </FormItem>
          )}
        />
      ) : (
        <Button
          variant={"linkHover2"}
          onClick={handleEditClick}
          className="ml-4 h-fit px-0 text-base !text-blue-700 text-paragraph after:w-full after:bg-blue-700"
        >
          Change Avatar
        </Button>
      )}
    </>
  );
}
