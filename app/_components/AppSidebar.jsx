"use client"
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import Image from 'next/image'
import { Compass, History, LogIn, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SignOutButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'

function AppSidebar() {

    const Menu=[
        {
            title: "Home",
            icon:Search,
            path: "/"
        },
        {
            title: "Discover",
            icon:Compass,
            path: "/discover"
        },
        {
            title: "Library",
            icon:History,
            path: "/library"
        },
        // {
        //     title: "Sign In",
        //     icon:LogIn,
        //     path: "/sign-in"
        // },
    ]

    const path = usePathname()
    const {user} = useUser()
  return (
    <Sidebar>
      <SidebarHeader className="bg-yellow-200 items-center " >
        <Image src={"/logo.png"} alt='logo' width={200} height={100} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
        <SidebarContent>
            <SidebarMenu>
                {Menu.map((menu,index)=>(
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className={` p-6   ${path?.includes(menu.path) && "font-bold"}`}>
                            <a href={menu.path}>
                                <menu.icon className='h-8 w-8'/>
                                <span className=' text-lg ' >{menu.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            { !user? <SignUpButton mode='modal'>
            <Button className={" rounded-4xl m-4 py-6 "}>
                <h1 className='text-lg'>
                    Sign Up
                </h1>
            </Button>
            </SignUpButton>: <SignOutButton>
            <Button className={" rounded-4xl m-4 py-6 "}>
                <h1 className='text-lg'>
                    Log Out
                </h1>
            </Button>
            </SignOutButton> }
        </SidebarContent>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border">
      <div className='my-3 items-center font-semibold font-mono flex gap-4'>
          Welcome Back <UserButton/>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">© 2025 GANGULY</span>
            <span className="text-xs font-medium text-primary"></span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with passion 
          </p>
        </div>
        
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar