// app/(main)/shop/page.tsx
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { FeedWrapper } from "@/components/feed-wrapper";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Items } from "./items";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const ShopPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/");
  }

  const isPro = !!userSubscription?.isActive;

  // Check if user cancelled but their paid period hasn't expired yet
  const periodEnd = userSubscription?.stripeCurrentPerriodEnd
    ? new Date(userSubscription.stripeCurrentPerriodEnd)
    : null;

  const isCancelledButValid =
    !isPro &&
    !!userSubscription &&
    !!periodEnd &&
    periodEnd > new Date();

  return (
    <div className="flex flex-row-reverse gap-12 px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
          streak={userProgress.streak ?? 0}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/shop.svg"
            alt="shop"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Shop
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Spend your points on cool stuff.
          </p>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
            isCancelledButValid={isCancelledButValid}
            periodEnd={periodEnd}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;