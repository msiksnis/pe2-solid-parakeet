import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { User } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Avatar } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { UpdateUserSchema, UpdateUserType } from "./AccountValidation";
import UpdateAvatarInput from "./components/UpdateAvatarInput";
import UpdateBioInput from "./components/UpdateBioInput";
import { Button } from "../ui/button";

interface ProfileFormProps {
  user?: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<UpdateUserType>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      avatar: {
        url: "",
        alt: "",
      },
      bio: "",
      venueManager: false,
    },
  });

  const {
    control,
    handleSubmit,
    // formState,
    // reset
  } = form;

  const isPending = false;
  const onSubmit = () =>
    // data: UpdateUserType
    {
      // mutation.mutate(data);
    };

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
            <UpdateAvatarInput control={control} />
          </div>
        </>
        <Separator className="mt-4" />

        <div>
          <div className="text-paragraph">EMAIL</div>
          <div className="text-lg font-semibold">{user?.email}</div>
        </div>
        <Separator className="mt-4" />

        <UpdateBioInput control={control} />
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

        <Button type="submit" disabled={isPending} className="mt-4">
          {isPending ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
