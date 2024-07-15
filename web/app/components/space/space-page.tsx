import { Suspense } from "react";
import { ReactFlowProvider } from "reactflow";
import { Link } from "react-router-dom";
import { SpaceList } from "@/components/space/space-list";
import { SpaceBoard } from "@/components/space//space-board";
import "reactflow/dist/style.css";

interface Props {
  spaceId?: number;
}

export const SpacePage = (props: Props) => {
  const { spaceId } = props;

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
        </div>
      </div>
      <div className="flex-auto h-full w-full">
        <div className="w-full h-full bg-muted rounded-md overflow-hidden p-1">
          {spaceId ? (
            <ReactFlowProvider key={`space-${spaceId}`}>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    Loading...
                  </div>
                }
              >
                <SpaceBoard spaceId={spaceId} />
              </Suspense>
            </ReactFlowProvider>
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
