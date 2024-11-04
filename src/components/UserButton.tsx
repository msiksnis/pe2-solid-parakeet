import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  HousePlus,
  LayoutGrid,
  LogOut,
  Megaphone,
  User,
  UserCircle,
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
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mt-2 w-fit min-w-80 rounded-xl p-0 shadow-xl"
            align="end"
          >
            <DropdownMenuGroup className="flex gap-x-2 px-4 py-2 pb-1">
              <Avatar className="size-12 transform cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                <AvatarImage
                  src={userAvatar?.url}
                  alt={`${userName}'s avatar`}
                />
                <AvatarFallback>
                  <User className="size-5" />
                </AvatarFallback>
              </Avatar>
              <DropdownMenuLabel className="flex flex-col">
                <span>Welcome</span>
                <span>{userName}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-0" />

            <DropdownMenuGroup>
              <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4">
                <UserCircle />
                Manage account
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4">
                <CalendarDays />
                Manage reservations
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4">
                <Megaphone />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-0" />

            {isVenueManager && (
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4">
                  <HousePlus />
                  Host a venue
                </DropdownMenuItem>
                <DropdownMenuItem className="flex cursor-pointer gap-4 rounded-none p-4">
                  <LayoutGrid />
                  Manage your venues
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
            <DropdownMenuSeparator className="my-0" />

            <DropdownMenuItem
              onClick={clearAuth}
              className="flex cursor-pointer gap-4 rounded-none p-4"
            >
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
