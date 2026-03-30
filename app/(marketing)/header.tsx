import Image from "next/image";
import { Loader } from "lucide-react";
import {
    ClerkLoaded,
    ClerkLoading,
} from "@clerk/nextjs";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const Header = () => {
    return (
        <header className="h-20 w-full border-b border-slate-200 px-4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/mascot1.svg" height={40} width={40} alt="Mascot" />
                    <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
                        WOrdiGo
                    </h1>
                </div>
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"  // ✅ Fixed: lowercase 's' in SignOut
                        />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">  
                            <Button size="lg" variant="ghost">
                                login
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    );
};