import React from 'react'
import Link from 'next/link'

export default async function HomePage() {
  return (
    <React.Fragment>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        Home Page
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/">Go to root</Link>
      </div>
    </React.Fragment>
  )
}
