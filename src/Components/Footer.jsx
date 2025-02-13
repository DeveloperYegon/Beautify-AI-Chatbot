import React from 'react'

function Footer() {

  const year = new Date().getFullYear();
  return (
   <footer className='bg-[#1E2938] h-20 text-white flex justify-center'>
<p className='text-center py-5'>&copy; {year}. &nbsp; Beautify. All rights are Reserved.</p>
   </footer>
  )
}

export default Footer