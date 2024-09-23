"use client";

import { AppShell, Button, CopyButton, Flex, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import AuthWrapper from './components/AuthWrapper';
import Sidebar from './components/sidebar';
import DashboardHeader from './components/DashboardHeader';
import { useUserContext } from '@/app/context/UserContext';
import { connectWithSocketIOServer, toast } from '@/app/utils/helper';
import { io, Socket } from "socket.io-client"


export default function DashboardLayout({ children }: PropsWithChildren) {
    // const location = useLocation()
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const { isLoggedIn, user } = useUserContext()
    const socketRef = useRef<Socket | null>(null);

    const establishConnectionToSocketServer = async () => {
        if (!user || socketRef.current) return;
        // await Notification.requestPermission();
        const socket = connectWithSocketIOServer(user)
        socketRef.current = socket;
    }

    useEffect(() => {
        establishConnectionToSocketServer()
    }, [user?.id])


    return (
        <AuthWrapper>
            <AppShell
                header={{ height: 90 }}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
                }}
                padding="md"
            >
                <AppShell.Header >
                    <DashboardHeader
                        // toggleDesktop={toggleDesktop}
                        toggleMobile={toggleMobile}
                        mobileOpened={mobileOpened}
                    // desktopOpened={desktopOpened}
                    />
                </AppShell.Header>

                <AppShell.Navbar >
                    <Sidebar />
                </AppShell.Navbar>
                <AppShell.Main

                    bg={dark ? "inherit" : "rgb(248, 249, 250)"}
                >
                    <Flex direction={"column"} p={10}>
                        {children}
                    </Flex>
                </AppShell.Main>
            </AppShell>
        </AuthWrapper>
    );
}