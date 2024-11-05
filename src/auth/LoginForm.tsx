import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginResponseType, LoginUserSchema } from "./UserValidation";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { loginUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

interface LoginProps {
  loading: boolean;
  onClose: () => void;
}

type LoginType = z.infer<typeof LoginUserSchema>;

export default function LoginForm({ loading, onClose }: LoginProps) {
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation<LoginResponseType, Error, LoginType>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const { accessToken, name, avatar, venueManager } = data;
      setAuth(
        accessToken,
        name,
        { url: avatar.url, alt: avatar.alt },
        venueManager,
      );
      toast.success("Logged in successfully");
      onClose();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    },
  });

  const onSubmit = (data: LoginType) => mutation.mutate(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-4 space-y-8">
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
                    className="h- h-full rounded-xl border-transparent pt-5 text-lg shadow-none focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="pl-1 pt-0.5" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant={"gooeyLeft"}
          className="h-14 w-full rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-lg font-semibold text-primary after:duration-700"
        >
          {loading ? (
            <span className="flex gap-x-2">
              Logging in
              <LoaderCircleIcon className="!size-6 animate-spin" />
            </span>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </Form>
  );
}
