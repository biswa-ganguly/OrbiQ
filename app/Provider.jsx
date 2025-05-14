"use client"
import { UserDetailsContext } from '@/context/UserDetailsContext'
import { supabase } from '@/services/Superbase'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'

function Provider({ children}) {
  const { user } = useUser()
  const [userDetail, setUserDetail]= useState()

  useEffect(() => {
    if (user) {
      CreateNewUser()
    }
  }, [user])

  const CreateNewUser = async () => {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq("email", user?.primaryEmailAddress.emailAddress)

    if (users.length === 0) {
      await supabase
        .from('users')
        .insert([
          { 
            name: user?.fullName,
            email: user?.primaryEmailAddress.emailAddress
          }
        ])
        .select()
        setUserDetail(data[0])
        return
    }
    setUserDetail(users[0])
  }

  return (

    <UserDetailsContext.Provider value={{userDetail, setUserDetail}} >
      <div className='w-full'>{children}</div>
    </UserDetailsContext.Provider>
    
  )
}

export default Provider
