"use client";

import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Tools } from "@/constants/tools";

const DashboardPage = () => {

    const router = useRouter()
    return (
        <div>
            <div className="mb-8 space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-center">Explore the Power of AI</h2>
                <p className="text-muted-foreground font-light text-sm md:text-base text-center">
                    Chat with the smartest AI - Experience the power of AI
                </p>
            </div>

            <div className="px-4 md:px-16 lg:px-32 space-y-4">
                {Tools.map((tool) => (
                    <Card key={tool.href} className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer" onClick={() => router.push(tool.href)}>
                        <div className="flex items-center gap-x-4">
                            <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                <tool.icon className={cn("w-6 h-6", tool.color)} />
                            </div>

                            <div className="font-semibold">
                                {tool.label}
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5"/>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default DashboardPage;