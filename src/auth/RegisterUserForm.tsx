import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registerUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import {
  RegisterUserResponseType,
  RegisterUserSchema,
  RegisterUserType,
} from "./UserValidation";
import { toast } from "sonner";

interface RegisterUserProps {
  loading: boolean;
  setAlreadyUser: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RegisterUserForm({
  setAlreadyUser,
}: RegisterUserProps) {
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const form = useForm<RegisterUserType>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      venueManager: false,
    },
  });

  const mutation = useMutation<
    RegisterUserResponseType,
    Error,
    RegisterUserType
  >({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      toast.success("User registered successfully");
      form.reset();
      setAlreadyUser(true);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      toast.error("User registration failed");
    },
  });

  const onSubmit = (data: RegisterUserType) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem
                className={cn(
                  "relative h-14 space-y-0 rounded-xl border border-gray-400 transition-all duration-300",
                  {
                    "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                      isNameFocused,
                  },
                  {
                    "border-destructive": form.formState.errors.name,
                  },
                  {
                    "ring-2 ring-destructive ring-offset-2":
                      form.formState.errors.name && isNameFocused,
                  },
                )}
              >
                <FormLabel
                  className={cn(
                    "absolute left-3 text-lg text-muted-foreground transition-all",
                    isNameFocused || field.value
                      ? "top-1.5 text-sm"
                      : "top-3.5",
                  )}
                >
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onFocus={() => setIsNameFocused(true)}
                    onBlur={() => setIsNameFocused(false)}
                    className="h-full rounded-xl border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="pl-1 pt-0.5" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem
                className={cn(
                  "relative h-14 space-y-0 rounded-xl border border-gray-400 transition-all duration-300",
                  {
                    "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                      isEmailFocused,
                  },
                  {
                    "border-destructive": form.formState.errors.email,
                  },
                  {
                    "ring-2 ring-destructive ring-offset-2":
                      form.formState.errors.email && isEmailFocused,
                  },
                )}
              >
                <FormLabel
                  className={cn(
                    "absolute left-3 text-lg text-muted-foreground transition-all",
                    isEmailFocused || field.value
                      ? "top-1.5 text-sm"
                      : "top-3.5",
                  )}
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    className="h-full rounded-xl border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="pl-1 pt-0.5" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem
                className={cn(
                  "relative h-14 space-y-0 rounded-xl border border-gray-400 transition-all duration-300",
                  {
                    "border-primary ring-2 ring-primary ring-offset-2 ring-offset-card":
                      isPasswordFocused,
                  },
                  {
                    "border-destructive": form.formState.errors.password,
                  },
                  {
                    "ring-2 ring-destructive ring-offset-2":
                      form.formState.errors.password && isPasswordFocused,
                  },
                )}
              >
                <FormLabel
                  className={cn(
                    "absolute left-3 text-lg text-muted-foreground transition-all",
                    isPasswordFocused || field.value
                      ? "top-1.5 text-sm"
                      : "top-3.5",
                  )}
                >
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="h-full rounded-xl border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="pl-1 pt-0.5" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="venueManager"
          render={({ field }) => (
            <FormItem className="ml-2 flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="venueManager"
                />
              </FormControl>
              <FormLabel htmlFor="venueManager" className="pb-1.5 text-base">
                Check if You are a Host
              </FormLabel>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={mutation.isPending}
          variant={"gooeyLeft"}
          className="h-14 w-full rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-lg font-semibold text-primary after:duration-700"
        >
          {mutation.isPending ? (
            <span className="flex gap-x-2">
              Signing up
              <LoaderCircleIcon className="!size-6 animate-spin" />
            </span>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </Form>
  );
}
