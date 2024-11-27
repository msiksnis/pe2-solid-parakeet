import { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import ErrorLoadingButton from "../ErrorLoadingButton";
import MainLoader from "../MainLoader";
import { Separator } from "../ui/separator";
import ProfileForm from "./components/ProfileForm.tsx";
import { fetchUser } from "./queries/fetchUser";
import { useSignInModalStore } from "@/hooks/useSignInModalStore.ts";
import { useAuthStatus } from "@/hooks/useAuthStatus.ts";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export default function Account() {
  const navigate = useNavigate();
  const { openSignInModal } = useSignInModalStore();
  const { isLoggedIn } = useAuthStatus();

  useEffect(() => {
    if (!isLoggedIn) {
      openSignInModal();
      navigate({ to: "/" });
    }
  }, [isLoggedIn, openSignInModal]);

  const {
    data: user,
    error,
    isError,
    refetch,
    isFetching,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
    retry: 2,
  });

  const errorMessage = isError
    ? `Error loading user: ${error.message}`
    : "An unexpected error occurred while loading the user.";

  if (isError) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl px-4 md:my-24 md:px-0">
      <div className="text-2xl font-semibold md:text-3xl">
        Manage your profile
      </div>
      <Separator className="mt-4" />
      {isFetching ? (
        <MainLoader className="mt-10" />
      ) : (
        <ProfileForm user={user!} />
      )}
    </div>
  );
}
