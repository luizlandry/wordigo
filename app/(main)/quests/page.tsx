import{ UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { FeedWrapper } from "@/components/feed-wrapper";
import { redirect } from "next/navigation";
import  Image  from "next/image";
import { Progress } from "@/components/ui/progress";
import { Promo } from "@/components/promo";
import { quests } from "@/constants";

const QuestsPage = async () => {
    const userProgressData = getUserProgress ();
    const userSubscriptionData = getUserSubscription();
   

    const [
        userProgress,
        userSubscription,
        
    ] = await Promise.all ([
        userProgressData,
        userSubscriptionData,
        
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/")
    }

    const isPro = !!userSubscription?.isActive;

    return (
        <div className="flex flex-row-reverse gap-12 px-6">
            <StickyWrapper>
                <UserProgress
                activeCourse = {userProgress.activeCourse}
                hearts={userProgress.hearts} 
                points= {userProgress.points}
                streak={userProgress.streak}
                hasActiveSubscription={isPro}
                />
                 {!isPro && (
                  <Promo />
                 )}
            </StickyWrapper>
            <FeedWrapper>
                <div className="full flex flex-col items-center">
                    <Image 
                    src="/quests.svg"
                    alt="quest"
                    height={90}
                    width={90}
                    />
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Quest
                    </h1>
                    <p className="text-muted-forground text-center text-lg mb-6">
                       complete quest by earning points.
                    </p>
                   <ul className="w-full">
                    { quests.map((quest) => {
                        const progress = (userProgress.points / quest.value) * 100;
                        
                        
                        return (
                            <div
                            className="flex items=center w-full p-4 gap-x-4 border-t-2"
                            key={quest.title}
                            >
                                <Image 
                                src="/points.svg"
                                alt="points"
                                width={60}
                                height={60}
                                />
                                <div className="flex flex-col gap-y-2 w-full">
                                    <p className="text-neutral-700 text-xl font-bold">
                                        {quest.title}
                                    </p>
                                    <Progress value = {progress} className="h-3" />
                                </div>
                            </div>
                        )
                        })}
                   </ul>
                </div>
            </FeedWrapper>
        </div>
    );
};

export default QuestsPage;