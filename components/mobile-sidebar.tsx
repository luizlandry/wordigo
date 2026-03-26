import { Menu } from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";




import  Sidebar  from "@/components/sidebar";


export const MobileSidebar = () => {
    console.log("MobileSidebar render");
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="text-white" />
            </SheetTrigger>
              <SheetContent className=" p-0 z-100 " side="left">
                <Sidebar />
              </SheetContent>
        </Sheet>
    );
};