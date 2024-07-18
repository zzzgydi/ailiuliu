import { Suspense } from "react";
import { ReactFlowProvider } from "reactflow";
import { Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { EllipsisVertical } from "lucide-react";
import { SpaceList } from "@/components/space/space-list";
import { SpaceBoard } from "@/components/space/space-board";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "reactflow/dist/style.css";

interface Props {
  spaceId?: number;
}

export const SpacePage = (props: Props) => {
  const { spaceId } = props;
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="w-screen h-screen flex overflow-hidden p-2 gap-2">
      <div className="flex-none w-[250px]">
        <div className="w-full h-full bg-background rounded-md overflow-hidden flex flex-col">
          <Link to="/">
            <h1 className="p-1 text-lg font-medium flex-none mt-2 mb-4">
              AI Liu Liu ~
            </h1>
          </Link>

          <div className="flex-auto h-full">
            <SpaceList />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-md cursor-pointer relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName}</AvatarFallback>
                </Avatar>

                <div className="text-base font-medium truncate">
                  {user?.fullName ??
                    user?.emailAddresses?.[0]?.emailAddress ??
                    "user"}
                </div>

                <EllipsisVertical className="ml-auto w-4 h-4 mr-2 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px]" align="end">
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-auto h-full w-full">
        <div className="w-full h-full bg-muted rounded-md overflow-hidden p-1">
          {spaceId ? (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  Loading...
                </div>
              }
            >
              <ReactFlowProvider key={`space-${spaceId}`}>
                <SpaceBoard spaceId={spaceId} />
              </ReactFlowProvider>
            </Suspense>
          ) : (
            <div className="flex items-center justify-center h-full text-lg text-gray-400">
              Select a space
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
