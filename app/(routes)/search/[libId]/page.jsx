"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Header from './_components/Header'
import { supabase } from '@/services/Superbase'
import DispalyResult from './_components/DispalyResult'

function SearchQueryResult() {
    

    const{libId} = useParams()
    const [searchInputRecord, setSearchInputRecord]= useState()

    useEffect(()=>{
        GetSearchQueryResult()
    }, [libId])

    const GetSearchQueryResult =async ()=>{

let { data: library, error } = await supabase
.from('library')
.select('*,Chats(*)')
.eq("libId", libId)

console.log(library[0])
setSearchInputRecord(library[0])
        
    }

  return (
    <div>
        <Header searchInputRecord={searchInputRecord}/>
        <div className='lg:px-12'>
        <DispalyResult searchInputRecord={searchInputRecord} />
        </div>
    </div>
  )
}

export default SearchQueryResult