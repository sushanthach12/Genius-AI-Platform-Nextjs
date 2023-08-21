"use client";

import React, { useEffect, useState } from 'react'
import ProModal from './pro-modal';

type Props = {}

const ModalProvider = (props: Props) => {

  // To avoid hydration error
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [mounted])

  if (!mounted) {
    return null;
  }
  //End


  return (
    <>
      <ProModal />
    </>
  )
}

export default ModalProvider