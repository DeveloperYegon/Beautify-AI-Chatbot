import React from 'react'

function Footer() {

  const year = new Date().getFullYear();
  return (
   <footer className=' h-10 bg-transparent font-bold fixed bottom-0 w-full text-[#000] flex justify-center'>
<p className='text-center py-2  '>&copy; {year}. &nbsp; Beautify AI. All rights are Reserved.</p>
   </footer>
  )
}

export default Footer