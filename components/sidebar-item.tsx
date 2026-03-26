"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button"
import Link from "next/link";
import Image from "next/image";


type Props= {
    label : string;
    iconSrc: string;
    href: string;
    imageClassName?: string;
};



import { cn } from "@/lib/utils";

export const Sidebaritem =({
    label,
    iconSrc,
    href,
    imageClassName,
}: Props) => {

    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Button 
           variant={active ? "sidebaroutline"  : "sidebar"}
           className="justify-start h-[52px]"
           asChild
            >
            <Link href={href}>

             <Image  
               src={iconSrc}
               alt={label}
               className={cn("mr-5 h-8 w-8 object-cover rounded", imageClassName)}
               height={32}
               width={32}
             />

              {label}
            </Link>
        </Button>
    );
};
