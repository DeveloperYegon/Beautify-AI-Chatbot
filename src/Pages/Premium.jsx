import React from 'react'

function Premium() {
  return (
    <main className='h-full pt-5 pb-11 rounded-[10px] bg-white'>
        
        <div className=' border md:w-1/2 rounded-[10px] m-3 md:m-auto p-5 border-slate-500'>
            <h1 className='text-3xl font-bold py-3 text-center'>Premium Subscription</h1>
            <hr className='w-[50%] h-1 m-auto bg-black' />

            <p className='text-center py-3 '>Subscribe to our premium plan to access exclusive features.</p>
            <ul className='text-center'>
              <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Get 20% discounts on Products shoppings every month.</li>
              <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Free Demartology check-ups and advice annually.</li>
              <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Email recommendation deliveries based on user preferences.</li>
             
              <li className='border border-amber-300 m-2 font-bold rounded-full p-2'>Free access to VIP tickets on product launch.</li>
            </ul>

            <div className='flex justify-center gap-4 mt-5'>
                <button className='bg-[#F0BA30] p-3 px-5 rounded-full font-bold'>Subscribe @ $1000</button>
            </div>
            <p className='text-center italic my-4'>*Unsubscribe Anytime*</p>
        </div>
    </main>
  )
}

export default Premium