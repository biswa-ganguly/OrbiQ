"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, AudioLines, Command, Cpu, Globe, icons, Mic, Paperclip, Pin, Search, SearchCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { AIModelsOption } from '@/services/Shared'
import { useUser } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/services/Superbase'
import { useRouter } from 'next/navigation'
  


  function ChatInputBox() {

    const [userSearchInput, setUserSearchInput]= useState()
    const [searchType, setSearchType]= useState("search")
    const {user} = useUser();
    const [loading,setLoading]= useState(false)
    const router = useRouter()



const onSearchQuery = async () => {
setLoading(true)

  const libId = uuidv4();

  const { data, error } = await supabase
    .from('library')
    .insert([
      {
        searchInput: userSearchInput,
        userEmail: user.primaryEmailAddress.emailAddress,
        type: searchType,
        libId: libId,
      },
    ])
    .select(); 

    router.push("/search/"+libId)


 
setLoading(false)
};



    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <Image src={"/logo.png"} width={280} height={120} alt='logo2' />
        <div className='p-2 w-full max-w-2xl border mt-6 rounded-xl'>
          <div className='flex justify-between items-end px-2'>
            <Tabs defaultValue="search" className="w-[400px]">
            <TabsContent value="search">
                <input type="text" placeholder='Ask anything' className='w-full p-4 outline-none' onChange={(e)=>setUserSearchInput(e.target.value)} />
              </TabsContent>
              <TabsContent value="research">
                <input type="text" placeholder='Research anything' className='w-full p-4 outline-none' onChange={(e)=>setUserSearchInput(e.target.value)} />
              </TabsContent>
              <TabsList>
                <TabsTrigger value="search" onClick={()=>setSearchType("search")} ><Search /> Search</TabsTrigger>
                <TabsTrigger value="research"><Command /> Research</TabsTrigger>
              </TabsList>

            </Tabs>
  
            <div className='flex items-center gap-3 text-gray-500'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost">
                    <Cpu />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator /> */}
                  {AIModelsOption.map((model,index)=>(
                    <DropdownMenuItem key={index} className={""}>
                        <div className='mb-2'>
                        <h2 className='text-sm'>{model.name}</h2>
                        <p className='text-xs'>{model.desc}</p>
                        </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
  
              <Button variant="ghost"><Globe /></Button>
              <Button variant="ghost"><Paperclip /></Button>
              <Button variant="ghost"><Mic /></Button>
              <Button className="bg-yellow-500 w-8 h-8" onClick={()=>(
                userSearchInput?onSearchQuery():null
              )}>
                {!userSearchInput?<AudioLines />:<ArrowRight disabled={loading} />}
                
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  

export default ChatInputBox