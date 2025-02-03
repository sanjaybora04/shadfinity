
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

// Menu items.
const items = [
  {
    title: "Chatbot",
    url: "#",
  },
]

export function AppSidebar() {
  const {theme, setTheme} = useTheme()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between">Shadfinity <Button size='icon' className="w-7 h-7" onClick={()=>setTheme(theme=='light'?'dark':'light')}>{theme=='light'?<Moon/>:<Sun/>}</Button></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton><Home/>Home</SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton><Puzzle/>Components</SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuSub>
              {items.map((item) => (
                <SidebarMenuSubItem key={item.title}>
                  <SidebarMenuSubButton>
                      <span>{item.title}</span>
                  </SidebarMenuSubButton>
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
