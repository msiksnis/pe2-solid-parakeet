import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface HostedByProps {
  owner: {
    avatar: {
      url: string;
      alt: string;
    };
    name: string;
  };
  className?: string;
}

export default function HostedBy({ owner, className }: HostedByProps) {
  const { name, avatar } = owner;
  return (
    <div className={cn(className)}>
      <div className="flex w-full items-center space-x-4">
        <Avatar className="cursor-pointer">
          <AvatarImage src={avatar.url} alt={avatar.alt} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <span>
          Hosted by <span className="capitalize">{name}</span>
        </span>
      </div>
    </div>
  );
}
