"use client";

import React, { useEffect, useState } from 'react'
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SideBar from '@/components/sidebar';

type MobileSidebarProps = {
    apiLimitCount: number;
    isPro: boolean;
}

const MobileSidebar = ({ apiLimitCount = 0, isPro = false }: MobileSidebarProps) => {

    // To remove the hydration error of the component
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }
    // End


    return (
        <Sheet>
            <SheetTrigger>
                <Button variant={'ghost'} size={"icon"} className='md:hidden'>
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent side='left' className='p-0'>
                <SideBar apiLimitCount={apiLimitCount} isPro={isPro}/>
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar