// lib/admin.ts
import { auth } from "@clerk/nextjs/server"; // ✅ Fixed: was "@clerk/nextjs"

const adminIds = [
  "user_362Ztu81s45TLBpS0jIZPZTL8ie",
];

export const isAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return adminIds.includes(userId);
};