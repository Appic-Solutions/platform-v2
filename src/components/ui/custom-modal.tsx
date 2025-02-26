import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export default function CustomModal({
  triggerTitle,
  title,
  children,
  triggerClassName,
}: {
  triggerTitle: string
  title: string
  children: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <>
      <div className="hidden md:block z-10">
        <Dialog>
          <DialogTrigger className={cn(triggerClassName)}>{triggerTitle}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              {children}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>

      <div className="md:hidden z-10">
        <Drawer>
          <DrawerTrigger className={cn(triggerClassName)}>{triggerTitle}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>
              {children}
            </DrawerDescription>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};