import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/App-sidebar';
import React from 'react';

type Props = {
    children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full m-2">
                <div className="flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4">
                    {/* Searchbar */}
                    <SidebarTrigger />
                    <div className="ml-auto"></div>
                </div>

                {/* <div className="mt-4">{children}</div> */}

                <div className="h-4"></div>

                {/* main content */}
                <div className="border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
};

export default SidebarLayout;
