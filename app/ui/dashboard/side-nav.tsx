import NavLinks from "@/app/ui/dashboard/nav-links";
import { signOut } from "@/auth";
import { PowerIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <Dialog>
          <DialogTrigger>
            <span className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
              <PowerIcon className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">Are you absolutely sure?</DialogTitle>
              
                <div className="flex flex-row gap-4 py-4 w-full items-center justify-center ">
                  <form
                    className="w-1/2 "
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button className="bg-red-500 p-2 w-full rounded-md text-white " >Sign Out</button>
                  </form>
                  <DialogTrigger className="w-1/2 p-2 rounded-md border">Close</DialogTrigger>
                </div>
                

            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
