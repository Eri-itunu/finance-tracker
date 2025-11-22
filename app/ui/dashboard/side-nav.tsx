import {NavLinks} from "@/app/ui/dashboard/nav-links";
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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white ">
      <div className="flex px-4 py-2 justify-between">
        <NavLinks />
       
        <Dialog>
          <DialogTrigger>
            <span className="flex h-12 w-12 items-center justify-center rounded-full text-gray-600 hover:text-purple-600 transition-colors">
              <PowerIcon className="w-8 h-8" />
            </span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">Are you sure you want to sign out?</DialogTitle>
              
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


