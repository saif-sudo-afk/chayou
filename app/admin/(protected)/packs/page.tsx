import { PacksManagement } from "@/components/admin/packs-management";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminPacks } from "@/lib/queries";

export default async function AdminPacksPage() {
  const packs = await getAdminPacks();

  return (
    <div className="space-y-8">
      <PageHeader
        description="Create curated combinations and manage pack pricing."
        title="Packs"
      />
      <PacksManagement packs={packs} />
    </div>
  );
}
