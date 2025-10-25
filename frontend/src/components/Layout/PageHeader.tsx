import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "../ui/sidebar";

const PageHeader = () => {
  return (
    <header className="w-full shrink-0 py-2 transition-[width,height] ease-linear">
      <div className="w-full justify-between">
        <div className="flex w-full items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
