import React from 'react'
import SideNav from './_components/SideNav'
import DashboradHeader from './_components/DashboradHeader'

function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <div>

        <div className='fixed md:w-64 '>
            <SideNav />
        </div>
        <div className='md:ml-64 '>
            <DashboradHeader />
            {children}
        </div>
      
    </div>
  )
}

export default DashboardLayout
