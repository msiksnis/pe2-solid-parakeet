import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Control, useController } from "react-hook-form";
import { UpdateUserType } from "../AccountValidation";

interface UpdateAvatarInputProps {
  control: Control<UpdateUserType>;
  resetFocus: boolean;
}

export default function UpdateAvatarInput({
  control,
  resetFocus,
}: UpdateAvatarInputProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    field: avatarUrlField,
    fieldState: { error },
  } = useController({
    name: "avatar.url",
    control,
  });

  useEffect(() => {
    if (isUpdating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUpdating]);

  useEffect(() => {
    if (resetFocus) {
      setIsFocused(false);
      setIsUpdating(false);
    }
  }, [resetFocus]);

  const handleEditClick = () => {
    setIsUpdating(true);
    setIsFocused(true);
    avatarUrlField.onChange("");
  };

  return (
    <>
      {isUpdating ? (
        <FormField
          control={control}
          name="avatar.url"
          render={({ field }) => (
            <div className="ml-6 w-full">
              <FormItem
                className={cn(
                  "relative mb-2 flex items-center rounded-md border border-gray-700 transition-all duration-300",
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
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="h-12 rounded-md border-none pt-5 text-base shadow-none focus-visible:ring-0"
                  />
                </FormControl>
              </FormItem>
              <FormMessage className="text-sm text-destructive">
                {error?.message}
              </FormMessage>
            </div>
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
