import { AuthLayout } from "@/components/base/auth-layout";
import { SpacePage } from "@/components/space/space-page";
import { useParams } from "react-router-dom";

export default function SpaceIdPage() {
  const { id } = useParams<{ id: string }>();
  const spaceId = id ? parseInt(id) : undefined;

  return (
    <AuthLayout>
      <SpacePage spaceId={spaceId} />
    </AuthLayout>
  );
}
