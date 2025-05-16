import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { Bookmark, Clock, Link, Share } from 'lucide-react'
import moment from 'moment'
import React from 'react'

function Header({ searchInputRecord }) {
  return (
    <div className='p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b'>
      {/* Left Section */}
      <div className='flex items-center gap-4 sm:gap-8'>
        <UserButton />
        <div className='flex items-center text-gray-500 gap-2 text-sm sm:text-base'>
          <Clock className='h-5 w-5 sm:h-6 sm:w-6' />
          <h2>{moment(searchInputRecord?.created_at).fromNow()}</h2>
        </div>
      </div>

      {/* Middle Section - Query Text */}
      <h2 className='text-lg sm:text-xl line-clamp-1 sm:max-w-md text-gray-700 text-center sm:text-left px-2'>
        {searchInputRecord?.searchInput}
      </h2>

      {/* Right Section - Buttons (Hidden on smaller screens) */}
      <div className='hidden sm:flex items-center gap-3'>
        <Button className="bg-yellow-500" size="icon"><Bookmark /></Button>
        <Button className="bg-yellow-500" size="icon"><Link /></Button>
        <Button className="bg-yellow-500 flex items-center gap-1 px-3"><Share /> <span className='hidden md:inline'>Share</span></Button>
      </div>
    </div>
  )
}

export default Header
