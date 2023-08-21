"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";


type Props = {}

const CrispChat = (props: Props) => {

  useEffect(() => {
    Crisp.configure("93cba60a-d9ef-4b32-b5da-4bfc17454116"); // CRISP_WEBSITE_ID
  }, [])
  

  return null;
}

export default CrispChat