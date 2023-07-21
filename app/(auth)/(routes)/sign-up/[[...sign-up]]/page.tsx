import React from 'react'
import { SignUp } from "@clerk/nextjs"

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <SignUp />
    </div>
  )
}

export default page