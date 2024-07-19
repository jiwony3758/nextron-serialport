import React from 'react'
import Link from 'next/link'
import SerialPortContainer from './components/serialport/serialport-container';
import Navigationbar from './components/common/Navigationbar';

export default async function RootPage() {


  return (
    <React.Fragment>
      <div className="h-10 bg-black">
            Test
      </div>
      <div className="grid grid-col-1 text-2xl w-full text-center">
      <SerialPortContainer/>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/home">Go to home page</Link>
      </div>
    </React.Fragment>
  )
}
