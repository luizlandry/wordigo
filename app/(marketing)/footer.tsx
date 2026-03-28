// app/(marketing)/footer.tsx
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center
            justify-center h-full gap-2">
                <Button size="lg" variant="ghost" className="w-auto px-4">
                    <Image 
                        src="/hr.svg"
                        alt="Croatian"
                        width={32}
                        height={24}
                        className="mr-2 rounded-md object-cover"
                    />
                    Croatian
                </Button>
                <Button size="lg" variant="ghost" className="w-auto px-4">
                    <Image 
                        src="/es.svg"
                        alt="Spanish"
                        width={32}
                        height={24}
                        className="mr-2 rounded-md object-cover"
                    />
                    Spanish
                </Button>
                <Button size="lg" variant="ghost" className="w-auto px-4">
                    <Image 
                        src="/fr.svg"
                        alt="French"
                        width={32}
                        height={24}
                        className="mr-2 rounded-md object-cover"
                    />
                    French
                </Button>
                <Button size="lg" variant="ghost" className="w-auto px-4">
                    <Image 
                        src="/it.svg"
                        alt="Italian"
                        width={32}
                        height={24}
                        className="mr-2 rounded-md object-cover"
                    />
                    Italian
                </Button>
                <Button size="lg" variant="ghost" className="w-auto px-4">
                    <Image 
                        src="/jp.svg"
                        alt="Japanese"
                        width={32}
                        height={24}
                        className="mr-2 rounded-md object-cover"
                    />
                    Japanese
                </Button>
                 <Button size="lg" variant="ghost" className="w-auto px-4">
                    <Image 
                        src="/en.svg"
                        alt="English"
                        width={32}
                        height={24}
                        className="mr-2 rounded-md object-cover"
                    />
                    English
                </Button>
            </div>
        </footer>
    );
};