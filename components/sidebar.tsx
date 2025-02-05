
import { Calendar, Home, Inbox, Moon, Puzzle, Search, Settings, Sun } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import Link from "next/link"
import { Separator } from "./ui/separator"

// Menu items.
const items = [
  {
    title: "Chatbot",
    url: "/components/chatbot",
  },
]

export function AppSidebar() {
  const {theme, setTheme} = useTheme()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between">
            <div className="flex gap-2 items-center"><img src="/images/favicon.svg" className="w-6 h-6 "/>Shadfinity</div>
            <Button size='icon' className="w-7 h-7" onClick={()=>setTheme(theme=='light'?'dark':'light')}>{theme=='light'?<Moon/>:<Sun/>}</Button>
            </SidebarGroupLabel>
            <Separator className="my-2"/>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton asChild>
                <Link href='/'>
                <Home/>Home
                </Link>
                </SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton><Puzzle/>Components</SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuSub>
              {items.map((item) => (
                <SidebarMenuSubItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
              </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
