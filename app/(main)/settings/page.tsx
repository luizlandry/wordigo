// app/(main)/settings/page.tsx
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Quests } from "@/components/quests";
import Image from "next/image";
import { Crown, CheckCircle, AlertCircle } from "lucide-react";
import { CancelSubscriptionButton } from './cancel-button';

const SettingsPage = async () => {
  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/");
  }

  const isPro = !!userSubscription?.isActive;

  const periodEnd = userSubscription?.stripeCurrentPerriodEnd
    ? new Date(userSubscription.stripeCurrentPerriodEnd).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

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
        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/mascot1.svg"
            alt="Settings"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
             Settings
          </h1>

          {isPro ? (
            <div className="w-full max-w-lg space-y-6">
              {/* Active Pro card */}
              <div className="border-2 border-yellow-300 bg-yellow-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-neutral-800">
                      Wordigo Pro — Active
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You have full access to all IELTS content
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                </div>

                <div className="border-t border-yellow-200 pt-4 space-y-2 text-sm text-neutral-700">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-semibold">Pro Monthly</span>
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">2,000 XAF / month</span>
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-semibold">MTN / Orange Money</span>
                    {periodEnd && (
                      <>
                        <span className="text-muted-foreground">Renews</span>
                        <span className="font-semibold">{periodEnd}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* What you have access to */}
              <div className="border-2 rounded-2xl p-6 space-y-3">
                <p className="font-bold text-neutral-800 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  Your Pro benefits
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-neutral-700">
                  <span>✅ All IELTS units (1–8)</span>
                  <span>✅ Unlimited hearts</span>
                  <span>✅ Writing evaluation</span>
                  <span>✅ Speaking practice</span>
                  <span>✅ Mock exam</span>
                  <span>✅ AI questions</span>
                </div>
              </div>

              {/* Cancel subscription */}
              <div className="border-2 border-red-100 bg-red-50 rounded-2xl p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-800 text-sm">
                      Cancel subscription
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      If you cancel, you will lose access to Pro features at the
                      end of your current billing period. Your progress is
                      always saved.
                    </p>
                  </div>
                </div>
                <CancelSubscriptionButton />
              </div>
            </div>
          ) : (
            /* Not Pro — redirect them to shop */
            <div className="text-center space-y-4 max-w-sm">
              <p className="text-muted-foreground">
                You don&apos;t have an active Pro subscription.
              </p>
              <a
                href="/shop"
                className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Upgrade to Pro
              </a>
            </div>
          )}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default SettingsPage;