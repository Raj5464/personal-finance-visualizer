import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function Header() {
  return (
    <div className="p-5 flex justify-between items-center border shadow-md">
      {/* Left section: Logo + Text */}
      <div className="flex items-center space-x-4">
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
        <p className="text-lg font-bold text-gray-900">Personal Finance Visualizer</p>
      </div>

      {/* Right section: Button wrapped in Link */}
      <Link href="/dashboard/console">
        <Button className="hover:bg-red-700">
          Get started
        </Button>
      </Link>
    </div>
  )
}

export default Header
