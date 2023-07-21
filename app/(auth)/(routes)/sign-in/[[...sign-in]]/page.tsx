import React from 'react'
import { SignIn } from "@clerk/nextjs"

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <SignIn />
    </div>
  )
}

export default page