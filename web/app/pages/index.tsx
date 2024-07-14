import { AuthLayout } from "@/components/base/auth-layout";
import { SpacePage } from "@/components/space/space-page";

export default function Index() {
  return (
    <AuthLayout>
      <SpacePage />
    </AuthLayout>
  );
}
