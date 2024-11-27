import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Control } from "react-hook-form";
import { UpdateUserType } from "../AccountValidation";

interface UpdateBioInputProps {
  control: Control<UpdateUserType>;
  bio: string;
  resetFocus: boolean;
}

export default function UpdateBioInput({
  control,
  bio,
  resetFocus,
}: UpdateBioInputProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<AutosizeTextAreaRef>(null);

  const focusTextArea = () => {
    textareaRef.current?.focus();
  };

  useEffect(() => {
    if (resetFocus) {
      setIsFocused(false);
      setIsUpdating(false);
    }
  }, [resetFocus]);

  const handleEditClick = () => {
    setIsUpdating(true);
    setIsFocused(true);
    // Slight delay to ensure the textarea is rendered before focusing
    setTimeout(() => {
      focusTextArea();
    }, 0);
  };

  return (
    <>
      {isUpdating ? (
        <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <FormItem
              className={cn(
                "relative mb-2 mt-2 flex w-full items-center rounded-md border border-gray-700 transition-all duration-300",
                {
                  "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                    isFocused,
                },
              )}
            >
              <FormLabel
                className={cn(
                  "absolute left-3 text-lg text-muted-foreground transition-all",
                  isFocused || field.value ? "top-1.5 text-sm" : "top-5",
                )}
              >
                Bio
              </FormLabel>
              <FormControl>
                <AutosizeTextarea
                  {...field}
                  ref={textareaRef}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="rounded-md border-none pt-5 !text-base shadow-none focus-visible:ring-0"
                />
              </FormControl>
            </FormItem>
          )}
        />
      ) : (
        <>
          <div>
            <div className="text-paragraph">BIO</div>
            <div className="text-lg font-semibold">{bio}</div>
          </div>
          <Button
            variant={"linkHover2"}
            onClick={handleEditClick}
            className="mt-2 h-fit px-0 text-base !text-blue-700 text-paragraph after:w-full after:bg-blue-700"
          >
            Update Bio
          </Button>
        </>
      )}
    </>
  );
}
