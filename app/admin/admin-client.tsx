"use client";

// app/admin/admin-client.tsx
// ✅ dynamic with ssr:false is only allowed inside a Client Component
import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { ssr: false });

export const AdminClient = () => {
  return <App />;
};