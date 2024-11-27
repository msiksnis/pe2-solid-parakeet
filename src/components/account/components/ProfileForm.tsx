import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form.tsx";
import { User } from "@/lib/types.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Avatar } from "../../ui/avatar.tsx";
import { Button } from "../../ui/button.tsx";
import { Checkbox } from "../../ui/checkbox.tsx";
import { Separator } from "../../ui/separator.tsx";
import { UpdateUserSchema, UpdateUserType } from "../AccountValidation.ts";
import { useUpdateUserMutation } from "../mutations/useUpdateUserMutation.ts";
import UpdateAvatarInput from "./UpdateAvatarInput.tsx";
import UpdateBioInput from "./UpdateBioInput.tsx";

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [mutationSuccess, setMutationSuccess] = useState(false);

  const mutation = useUpdateUserMutation(user.name);

  const avatarObject = { url: user.avatar.url, alt: user.avatar.alt };

  const form = useForm<UpdateUserType>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      avatar: avatarObject,
      bio: user.bio || "",
      venueManager: user.venueManager || false,
    },
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = (data: UpdateUserType) => {
    mutation.mutate(data, {
      onSuccess: (updatedUser) => {
        reset({
          avatar: { url: updatedUser.avatar.url, alt: updatedUser.avatar.alt },
          bio: updatedUser.bio || "",
          venueManager: updatedUser.venueManager || false,
        });
        setMutationSuccess(true);
      },
    });
  };

  useEffect(() => {
    if (user) {
      reset({
        avatar: avatarObject,
        bio: user.bio || "",
        venueManager: user.venueManager || false,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (mutationSuccess) {
      setMutationSuccess(false);
    }
  }, [mutationSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
        <div>
          <div className="text-paragraph">NAME</div>
          <div className="text-lg font-semibold">{user?.name}</div>
        </div>
        <Separator className="mt-4" />

        <>
          <div className="flex items-end">
            <Avatar className="size-40">
              <img
                src={user?.avatar.url}
                alt={user?.avatar.alt}
                className="size-40 rounded-full object-cover"
              />
            </Avatar>
            <UpdateAvatarInput control={control} resetFocus={mutationSuccess} />
          </div>
        </>
        <Separator className="mt-4" />

        <div>
          <div className="text-paragraph">EMAIL</div>
          <div className="text-lg font-semibold">{user?.email}</div>
        </div>
        <Separator className="mt-4" />

        <UpdateBioInput
          control={control}
          bio={user.bio}
          resetFocus={mutationSuccess}
        />
        <Separator className="mt-4" />

        <div>
          {user?.venueManager ? (
            <div className="font-semibold">YOU ARE A VENUE MANAGER</div>
          ) : (
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
                  <FormLabel
                    htmlFor="venueManager"
                    className="pb-1.5 text-base"
                  >
                    BECOME A VENUE MANAGER
                  </FormLabel>
                </FormItem>
              )}
            />
          )}
        </div>
        <Separator className="mt-4" />

        <div className="flex justify-end py-10">
          <Button
            type="submit"
            variant={"gooeyRight"}
            size={"lg"}
            disabled={mutation.isPending}
            className="before:duration-500"
          >
            {mutation.isPending ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
