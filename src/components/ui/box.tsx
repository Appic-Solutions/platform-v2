import { cn } from "@/lib/utils"
import { FC, ReactNode } from "react"

interface BoxProps {
  children: ReactNode
  className?: string
}

const Box: FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden w-full h-full px-6 pt-10 m-auto",
        "flex flex-col items-center justify-between",
        "md:border-[11px] md:border-box-border md:rounded-lg md:pb-6",
        "*:z-10",
        // Box Background
        "max-md:before:hidden before:content-[''] before:absolute before:inset-0",
        "before:bg-box-background before:bg-center before:bg-no-repeat",
        className
      )}>
      {children}
    </div>
  )
}

export default Box