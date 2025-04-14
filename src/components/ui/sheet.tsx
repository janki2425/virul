"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

const SheetPortal = (props: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Portal>) => (
  <SheetPrimitive.Portal {...props} />
)
SheetPortal.displayName = SheetPrimitive.Portal.displayName

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100] bg-black/80 transition-opacity duration-500 ease-in-out",
      "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
      className
    )}
    {...props}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right"
  }
>(({ className, children, side = "right", ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      forceMount
      className={cn(
        "fixed z-[101] bg-white p-6 shadow-lg outline-none transition-transform duration-500 ease-in-out transform will-change-transform",
        side === "top" &&
          "inset-x-0 top-0 h-3/4 data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
        side === "bottom" &&
          "inset-x-0 bottom-0 h-3/4 data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
        side === "left" &&
          "inset-y-0 left-0 w-full md:w-[500px] data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0",
        side === "right" &&
          "inset-y-0 right-0 w-3/4 md:w-[500px] data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close
        className={cn(
          "absolute right-4 top-10 rounded-sm opacity-70 transition-opacity duration-500 ease-in-out",
          "hover:opacity-100 focus:outline-none disabled:pointer-events-none",
          "data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

export { Sheet, SheetTrigger, SheetContent, SheetClose }
