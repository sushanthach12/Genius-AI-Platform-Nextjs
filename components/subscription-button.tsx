"use client"

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Zap } from "lucide-react";
import { useState } from "react";

type Props = {
    isPro: boolean;
}

const SubscriptionButton = ({ isPro = false }: Props) => {

    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/api/stripe");

            window.location.href = response.data.url
        } catch (error) {
            console.log("BILLIN_ERROR", error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant={isPro ? "default" : "premium"}
            onClick={handleClick}
        >
            {isPro ? "Manage Subscription" : "Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
        </Button>
    )
}

export default SubscriptionButton