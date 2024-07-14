import useSWR from "swr";
import { fetcher } from "@/services/base";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/utils/ui";

export const SpaceList = () => {
  const { id } = useParams<{ id: string }>();
  const { data: spaceList, mutate } = useSWR<ISpace[]>("/api/space/list");

  const handleCreate = async () => {
    const name = window.prompt("Enter space name");
    if (!name) return;

    await fetcher("/api/space/create", {
      method: "POST",
      body: { name },
    });

    mutate();
  };

  const spaceId = id ? parseInt(id) : null;

  return (
    <div className="h-full overflow-y-auto">
      <div
        onClick={handleCreate}
        className="mb-4 cursor-pointer border inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-9 px-4 py-2 w-full justify-start"
      >
        Create Space
      </div>

      {spaceList?.map((space) => (
        <Link key={space.id} to={`/space/${space.id}`}>
          <div
            className={cn(
              `mb-2 cursor-pointer inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 w-full justify-start`,
              space.id === spaceId
                ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 "
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div>{space.name}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};
