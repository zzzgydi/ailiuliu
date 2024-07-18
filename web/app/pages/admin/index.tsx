import useSWR from "swr";
import { ColumnDef } from "@tanstack/react-table";
import { AuthLayout } from "@/components/base/auth-layout";
import { CreateModelForm } from "@/components/admin/create-model-form";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/services/base";
import { toast } from "@/components/ui/use-toast";

const Page = () => {
  const { data, mutate } = useSWR<IModelProvider[]>("/api/admin/model/list");

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this model?"
    );
    if (!confirmDelete) return;
    try {
      await fetcher("/api/admin/model/delete", {
        method: "POST",
        body: { id },
      });
      toast({ title: "Success", description: "Deleted successfully" });
      mutate();
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    }
  };

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
    {
      accessorKey: "id",
      header: "Actions",
      cell: (row) => {
        return (
          <div className="flex items-center space-x-2">
            {/* <Button
              size={"mini"}
              onClick={() => {
                // TODO
                console.log("Edit", row);
              }}
            >
              Edit
            </Button> */}
            <Button
              size={"mini"}
              variant={"destructive"}
              onClick={() => handleDelete(row.row.original.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
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
