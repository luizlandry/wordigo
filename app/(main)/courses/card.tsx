"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type CardProps = {
    id: number;
    title: string;
    imageSrc: string;
    onClick: (id: number) => void;
    disabled: boolean;
    active: boolean;
};

export const Card = ({
    id,
    title,
    imageSrc,
    onClick,
    disabled,
    active
}: CardProps) => {
    return (
        <div
            onClick={() => onClick(id)}
            className={cn(
                "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px]",
                disabled && "pointer-events-none opacity-50",
                active && "border-sky-700 bg-sky-100"
            )}
        >
            <div className="min-[24px] w-full flex items-center justify-end">
                {active && (
                    <div className="rounded-md bg-sky-700 flex items-center justify-center p-1.5">
                        <Image 
                            src="/check.svg"
                            alt="check"
                            width={20}
                            height={20}
                        />
                    </div>
                )}
            </div>
            <Image
                src={imageSrc}
                alt={title}
                width={93.33}
                height={70}
                className="rounded-lg drop-shadow-md border object-cover"
            />
            <p className="text-neutral-700 text-center font-bold mt-3">
                {title}
            </p>
        </div>
    );
};