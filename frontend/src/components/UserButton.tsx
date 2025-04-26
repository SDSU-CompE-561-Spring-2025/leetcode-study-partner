import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

function UserButton() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="User Menu">
          <Avatar className="h-[1.8rem] w-[1.8rem]">
            <AvatarImage src={user?.name} />
            <AvatarFallback>
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "??"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[1px]">
        <DropdownMenuItem className="flex items-center justify-between px-2 py-1">
          Profile
          <User className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-between px-2 py-1">
          Log out
          <LogOut className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
