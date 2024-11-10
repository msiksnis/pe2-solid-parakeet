import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Link } from "@tanstack/react-router";
import {
  CalendarDaysIcon,
  HeartIcon,
  HousePlusIcon,
  LayoutGridIcon,
  LogOutIcon,
  UserCircleIcon,
  UserIcon,
} from "lucide-react";

interface UserButtonProps {}

export default function UserButton({}: UserButtonProps) {
  const { isLoggedIn, isVenueManager } = useAuthStatus();
  const { userName, userAvatar, clearAuth } = useAuthStore();

  return (
    <div className="">
      {isLoggedIn && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-10 transform cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
              <AvatarImage src={userAvatar?.url} alt={`${userName}'s avatar`} />
              <AvatarFallback>
                <UserIcon className="size-5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="shadow-custom mt-2 w-fit min-w-80 rounded-xl p-0"
            align="end"
          >
            <DropdownMenuGroup className="flex gap-x-2 px-4 py-2 pb-1">
              <Avatar className="size-12 transform cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                <AvatarImage
                  src={userAvatar?.url}
                  alt={`${userName}'s avatar`}
                />
                <AvatarFallback>
                  <UserIcon className="size-5" />
                </AvatarFallback>
              </Avatar>
              <DropdownMenuLabel className="flex max-w-52 flex-col text-base">
                <span>Welcome</span>
                <span className="truncate">{userName}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-0" />

            <DropdownMenuGroup>
              <Link to="/account">
                <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4 text-base">
                  <UserCircleIcon className="!size-6" />
                  Manage account
                </DropdownMenuItem>
              </Link>
              <Link to="/manage-reservations">
                <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4 text-base">
                  <CalendarDaysIcon className="!size-6" />
                  Manage reservations
                </DropdownMenuItem>
              </Link>
              <Link to="/favorites">
                <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4 text-base">
                  <HeartIcon className="!size-6" />
                  Favorite venues
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-0" />

            {isVenueManager && (
              <DropdownMenuGroup>
                <Link
                  to="/manage-venues/host-venue/$id"
                  params={{ id: "new-venue" }}
                >
                  <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4 text-base">
                    <HousePlusIcon className="!size-6" />
                    Host a venue
                  </DropdownMenuItem>
                </Link>
                <Link to="/manage-venues">
                  <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4 text-base">
                    <LayoutGridIcon className="!size-6" />
                    Manage your venues
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator className="my-0" />

            <DropdownMenuItem
              onClick={clearAuth}
              className="flex cursor-pointer gap-4 rounded-none p-4 text-base"
            >
              <LogOutIcon className="!size-6" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
