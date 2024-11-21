"use client";

import { Business } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useBusinessStore } from "../store";
import { useWorkspace } from "@/app/(workspace)/workspace-context";
import BusinessForm from "../components/create-update-business-form";

export default function CreateBusiness() {
  const router = useRouter();
  const { workspace } = useWorkspace();
  const { createNewBusiness } = useBusinessStore();

  const handleCreate = async (data: Business) => {
    const result = await createNewBusiness({ ...data, workspaceId: `${workspace?.id}` });
    if (result.success) {
      router.push(`/${workspace?.name}/business`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Business</h1>
      <BusinessForm onSubmit={handleCreate} />
    </div>
  );
}
