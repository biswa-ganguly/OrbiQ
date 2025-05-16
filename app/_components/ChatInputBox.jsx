"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, AudioLines, Command, Cpu, Globe, Mic, Paperclip, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AIModelsOption } from '@/services/Shared'
import { useUser } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/services/Superbase'
import { useRouter } from 'next/navigation'

function ChatInputBox() {

  const [userSearchInput, setUserSearchInput] = useState()
  const [searchType, setSearchType] = useState("search")
  const { user } = useUser();
  const [loading, setLoading] = useState(false)
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

    router.push("/search/" + libId)
    setLoading(false)
  };

  return (
    <div className='flex flex-col items-center justify-center  p-4'>
      <Image src={"/logo.png"} width={280} height={120} alt='logo2' />
      <div className='p-2 w-full max-w-2xl border mt-6 rounded-xl'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 px-2'>
          <Tabs defaultValue="search" className="w-full sm:w-[400px]">
            <TabsContent value="search">
              <input
                type="text"
                placeholder='Ask anything'
                className='w-full p-4 outline-none'
                onChange={(e) => setUserSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && userSearchInput) {
                    onSearchQuery();
                  }
                }}
              />
            </TabsContent>
            <TabsContent value="research">
              <input
                type="text"
                placeholder='Research anything'
                className='w-full p-4 outline-none'
                onChange={(e) => setUserSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && userSearchInput) {
                    onSearchQuery();
                  }
                }}
              />
            </TabsContent>
            <TabsList className="w-full sm:w-auto flex">
              <TabsTrigger value="search" onClick={() => setSearchType("search")} className="flex-1 sm:flex-none"><Search className='mr-2' /> Search</TabsTrigger>
              <TabsTrigger value="research" className="flex-1 sm:flex-none"><Command className='mr-2' /> Research</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='flex items-center justify-between sm:justify-end gap-2 text-gray-500 w-full sm:w-auto'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost">
                  <Cpu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AIModelsOption.map((model, index) => (
                  <DropdownMenuItem key={index}>
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
            <Button className="bg-yellow-500 w-8 h-8" onClick={() => (
              userSearchInput ? onSearchQuery() : null
            )}>
              {!userSearchInput ? <AudioLines /> : <ArrowRight className={`${loading ? "animate-pulse" : ""}`} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBox
