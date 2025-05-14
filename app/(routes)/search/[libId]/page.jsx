"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

function SearchQueryResult() {

    const{libId} = useParams()
    console.log(libId)

    useEffect(()=>{
        GetSearchQueryResult()
    })

    const GetSearchQueryResult =async ()=>{

let { data: library, error } = await supabase
.from('library')
.select('*')
.eq("libId", libId)
        
    }

  return (
    <div>SearchQueryResult</div>
  )
}

export default SearchQueryResult