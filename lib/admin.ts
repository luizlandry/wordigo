import { auth } from "@clerk/nextjs"

const adminIds = [
    "user_362Ztu81s45TLBpS0jIZPZTL8ie"
];

export const  isAdmin =  () => {
    const { userId } = auth()


    if (!userId) {
        return false;
    }

    return adminIds.indexOf(userId) !== -1
}