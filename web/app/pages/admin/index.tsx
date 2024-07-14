import useSWR from "swr";
import { ColumnDef } from "@tanstack/react-table";
import { AuthLayout } from "@/components/base/auth-layout";
import { CreateModelForm } from "@/components/admin/create-model-form";
import { DataTable } from "@/components/ui/data-table";

const Page = () => {
  const { data, mutate } = useSWR<IModelProvider[]>("/api/admin/model/list");

  const columns: ColumnDef<IModelProvider>[] = [
    {
      accessorKey: "label",
      header: "Label",
    },
    {
      accessorKey: "provider",
      header: "Provider",
    },
    {
      accessorKey: "value",
      header: "Value",
    },
    {
      accessorKey: "level",
      header: "Level",
    },
  ];

  return (
    <div className="w-full h-full px-6 lg:px-8">
      <h1 className="text-xl font-medium py-4">Admin Liu Liu ~</h1>

      <div className="py-2 flex items-center justify-end">
        <CreateModelForm onChange={() => mutate()} />
      </div>

      <DataTable columns={columns} data={data || []} />
    </div>
  );
};

export default function AdminIndex() {
  return (
    <AuthLayout>
      <Page />
    </AuthLayout>
  );
}
