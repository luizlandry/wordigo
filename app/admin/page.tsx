// app/admin/page.tsx
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminClient } from "./admin-client";

// isAdmin is now async because auth() from @clerk/nextjs/server is async
const AdminPage = async () => {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  return <AdminClient />;
};

export default AdminPage;