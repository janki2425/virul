import Image from 'next/image'
import React from 'react'

const Event = () => {
  return (
    <div className='px-4 mt-4'>
        <div className='flex items-center justify-between px-2'>
            <h2 className='text-[20px] font-[600]'>Upcoming Events</h2>
            <div className='flex items-center'>
                <p className='text-[16px] font-[100] text-[#EC248F]'>View all</p>
                <Image src={'/view-more.svg'} width={30} height={30} alt='view all' className=''/>
            </div>
        </div>
      <div>
      </div>
    </div>
  )
}

export default Event
