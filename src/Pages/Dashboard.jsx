import React,{useState} from 'react'
import Chat from './Chat'
import Sidebar from '../Components/Sidebar'

function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <main className='flex  fixed h-full'>
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)}/>
        <Chat />
    </main>
  )
}

export default Dashboard