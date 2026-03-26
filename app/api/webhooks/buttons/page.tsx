import { Button } from "@/components/ui/button";

const ButtonsPage = () => {
    return (
        <div className="p-4 space-y-4 flex flex-col max-w-[200px]">
            <Button>
                Default
           </Button>
            <Button variant="primary">
                primary
           </Button>
            <Button variant="primaryoutline">
                primary outline
            </Button>
             <Button variant="secondary">
               secondary
           </Button>
            <Button variant="secondaryoutline">
                secondary outline
            </Button>
            <Button variant="danger">
               Danger 
           </Button>
            <Button variant="dangeroutline">
                Danger outline
            </Button>
             <Button variant="super">
               super 
           </Button>
            <Button variant="superoutline">
                super outline
            </Button>
             <Button variant="ghost">
               ghost 
           </Button>
             <Button variant="sidebar">
               sidebar
           </Button>
            <Button variant="sidebaroutline">
                sidebar outline
            </Button>
        </div>
    );
};
export default ButtonsPage;