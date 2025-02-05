"use client"

import { ThemeProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { AppSidebar } from "./sidebar"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (

    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <SidebarProvider defaultOpen>
        <AppSidebar/>
        <SidebarTrigger className="md:hidden absolute top-2 left-2"/>
        {children}
      </SidebarProvider>
      <Toaster/>
    </ThemeProvider>
  )
}
