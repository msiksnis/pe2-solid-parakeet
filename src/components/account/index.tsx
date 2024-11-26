import { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import ErrorLoadingButton from "../ErrorLoadingButton";
import MainLoader from "../MainLoader";
import { Separator } from "../ui/separator";
import ProfileForm from "./ProfileForm";
import { fetchUser } from "./queries/fetchUser";

interface AccountProps {}

export default function Account({}: AccountProps) {
  const {
    data: user,
    error,
    isError,
    refetch,
    isFetching,
  } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  console.log(user);

  const errorMessage = isError
    ? `Error loading user: ${error.message}`
    : "An unexpected error occurred while loading the user.";

  if (isError) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }
  return (
    <div className="mx-auto mt-4 max-w-2xl px-4 md:my-24 md:px-0">
      <div className="text-2xl font-semibold md:text-3xl">
        Manage your profile
      </div>
      <Separator className="mt-4" />
      {isFetching ? (
        <MainLoader className="mt-10" />
      ) : (
        <ProfileForm user={user} />
      )}
    </div>
  );
}
