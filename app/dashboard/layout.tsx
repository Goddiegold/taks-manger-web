"use client";

import { AppShell, Button, CopyButton, Flex, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import AuthWrapper from './components/AuthWrapper';
import Sidebar from './components/sidebar';
import DashboardHeader from './components/DashboardHeader';
// import AuthWrapper from './AuthWrapper';
// import Sidebar from './Sidebar';
// import DashboardHeader from '../shared/DashboardHeader';
// import { Outlet, useLocation } from 'react-router-dom';
// import AuthWrapper from '../shared/AuthWrapper';
// import RegisterCompanyModal from '../shared/RegisterCompanyModal';
// import { useUserContext } from '@/context/UserContext';
// import { user_role } from '@/shared/types';

interface Props {
    children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
    // const location = useLocation()
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const [isMobile, setIsMobile] = useState(false);

    // Function to check if the screen size is mobile
    const checkMobile = () => {
        const isMobileDevice = window.innerWidth <= 768; // You can adjust this threshold according to your design
        setIsMobile(isMobileDevice);
    };

    // useEffect hook to run the checkMobile function when the component mounts and when the window is resized
    useEffect(() => {
        checkMobile(); // Check initially
        window.addEventListener('resize', checkMobile); // Check on window resize
        return () => {
            window.removeEventListener('resize', checkMobile); // Clean up on unmount
        };
    }, []);

    // const { isLoggedIn, user } = useUserContext()
    return (
        // <AuthWrapper>
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
                    {/* <NavbarSimpleColored /> */}
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
        // </AuthWrapper>
    );
}