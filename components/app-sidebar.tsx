import { LayoutDashboard, SquarePlus, UserRound, LogOut } from "lucide-react"
import Image from "next/image"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "New Entry",
        url: "/new-entry",
        icon: SquarePlus,
    },
    {
        title: "Customer Data",
        url: "/customer-data",
        icon: UserRound,
    },
    {
        title: "Log Out",
        url: "/login",
        icon: LogOut,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <Image src="/logo.png"
                width={500}
                height={500}
                className="p-4"
                alt="LaundryVille LaundryStation Logo" />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Overview
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
