import Image from 'next/image'
import React from 'react'

function AnswerDisplay({searchResult}) {

    const webResult = searchResult?.web?.results
  return (
    <div>
        <div>
            {webResult.map((item,index)=>{
                <div key={index} className='flex items-center gap-2'>
                    <div>
                        <Image src={item?.profile?.img} alt={item?.profile?.name} width={20} height={20} />
                        <h2 className='text-xs' >{item?.profile?.long_name }</h2>

                    </div>
                </div>
            })}
        </div>
    </div>
  )
}

export default AnswerDisplay