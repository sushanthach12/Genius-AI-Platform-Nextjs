import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React from 'react'

interface HeadingProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    bgColor?: string;
}

const Heading = ({ title, description, icon: Icon, iconColor, bgColor }: HeadingProps) => {
    return (
        <div className='px-4 lg:px-8 flex items-center gap-x-3 mb-8'>
            <div className={cn("p-2 w-fit rounded-md", bgColor)}>
                <Icon className={cn("w-7 h-7", iconColor)} />
            </div>

            <div>
                <h2 className='text-2xl font-semibold'>{title}</h2>
                <p className='text-xs text-muted-foreground'>{description}</p>
            </div>
        </div>
    )
}

export default Heading