import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Fixed: Capital B to lowercase

type Props = {
    onClick: () => void;
    status: "correct" | "wrong" | "none" | "completed"; // Fixed: removed "current", fixed type
    disabled: boolean;
    lessonId: number;
};

export const Footer = ({  // Fixed: = not {
    onClick,
    status,
    disabled,
    lessonId,
}: Props) => {  // Fixed: removed ! and fixed syntax
    useKey("Enter", onClick, {}, [onClick]); // Fixed: onCLick -> onClick
    const isMobile = useMedia("(max-width: 1024px)");

    return (
        <footer className={cn(  // Fixed: Footer -> footer (lowercase HTML element)
            "lg:h-[140px] h-[100px] border-t-2", // Fixed: -h[140px] -> h-[140px]
            status === "correct" && "border-transparent bg-green-100", // Fixed: blue-100 -> green-100
            status === "wrong" && "border-transparent bg-rose-100",
        )}>
            <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
                {status === "correct" && ( // Fixed: removed extra space in "correct "
                    <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
                        <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" /> {/* Fixed: w-5 -> w-6 */}
                        Nicely done!
                    </div>
                )}
                {status === "wrong" && (
                    <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center"> {/* Fixed: flax -> flex */}
                        <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
                        Try again. {/* Fixed: agian -> again */}
                    </div>
                )}
                {status === "completed" && (
                    <Button
                        variant="default"
                        size={isMobile ? "sm" : "lg"}
                        onClick={() => window.location.href = `/lesson/${lessonId}`} 
                    >
                        Practice again
                    </Button>
                )}
                <Button
                    disabled={disabled}
                    className="ml-auto" 
                    onClick={onClick} 
                    size={isMobile ? "sm" : "lg"}
                    variant={status === "wrong" ? "danger" : "secondary"}
                >
                    {status === "none" && "Check"}
                    {status === "correct" && "Next"} {/* Fixed: next -> Next */}
                    {status === "wrong" && "Retry"} {/* Fixed: retry -> Retry */}
                    {status === "completed" && "Continue"} {/* Fixed: continue -> Continue */}
                </Button>
            </div>
        </footer>
    );
};