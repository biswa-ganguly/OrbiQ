import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { Bookmark, Clock, Link, Share } from 'lucide-react'
import moment from 'moment'
import React from 'react'

function Header( {searchInputRecord} ) {
  return (
    <div className='p-4 flex justify-between items-center border-b'>
        <div className='flex items-center gap-8'>
            <UserButton/>
            <div className='flex items-center text-gray-500 gap-2'>
                <Clock className='h-6 w-6'/>
                <h2>{moment(searchInputRecord?.created_at).fromNow()}</h2>
            </div>
        </div>
        <h2 className='text-xl line-clamp-1 max-w-md'>{searchInputRecord?.searchInput}</h2>
        <div className='flex items-center  gap-3'>
            <Button className={"bg-yellow-500"} ><Bookmark/></Button>
            <Button className={"bg-yellow-500"} ><Link/></Button>
            <Button className={"bg-yellow-500"}><Share/> Share</Button>
        </div>
    </div>
  )
}

export default Header