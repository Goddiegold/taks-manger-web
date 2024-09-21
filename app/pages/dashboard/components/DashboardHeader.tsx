"use client";
import Logo from "@/app/components/Logo";
import { useUserContext } from "@/app/context/UserContext";
import { getInitials, menuData, removeUserToken } from "@/app/utils/helper";
import { Action_Type } from "@/app/utils/types";
import {
    ActionIcon, Avatar, Burger, Button, Flex, Group,
    Menu,
    Text, Tooltip, useMantineColorScheme
} from "@mantine/core";
import { CaretRight, Moon, SignOut, Sun } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
    mobileOpened: boolean,
    toggleMobile: () => void,
}


const DashboardHeader: React.FC<DashboardHeaderProps> =
    ({ mobileOpened, toggleMobile }) => {
        const { colorScheme, toggleColorScheme } = useMantineColorScheme();
        const dark = colorScheme === 'dark';
        const { user, userDispatch } = useUserContext()
        const router = useRouter()

        const handleLogout = () => {
            removeUserToken()
            userDispatch({
                type: Action_Type.LOGOUT_USER,
                payload: null
            })
            router.push("/pages/login")
        }

        const MenuOptions = () => {
            return (<>
                {menuData?.map((item, idx) => (
                    <Menu.Item
                        key={idx}
                        onClick={() => { if (item.link === "#") return; router.push(item.link) }}
                        my={10}
                        leftSection={<item.icon size={20} />}>{item.label}</Menu.Item>
                ))}
            </>)
        }
        return (
            <Group h="100%" px="md" justify="space-between">
                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                <Logo />
                <Flex align={'center'}>
                    <Flex className="hidden md:block">
                        <Tooltip label={dark ? "Light mode" : "Dark mode"}>
                            <ActionIcon
                                size={'lg'}
                                radius={10}
                                // mx={5}
                                variant="outline"
                                color='gray'
                                onClick={() => toggleColorScheme()}
                                title="Toggle color scheme"
                            >
                                {dark ? <Sun size={25} color='gray' /> : <Moon size={25} color='gray' />}
                            </ActionIcon>
                        </Tooltip>


                    </Flex>

                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Button
                                maw={300}
                                mih={60}
                                p={0}
                                m={0}
                                className="-mr-[20px] md:mr-0"
                                variant="transparent"
                                rightSection={<CaretRight size={20} color='gray' className='hidden md:block' />}>
                                <Flex direction={'row'} align={'center'} className='w-full'>
                                    <Avatar
                                        mx={10}
                                        radius={50}
                                        w={50}
                                        h={50}
                                        src={""}
                                    >{getInitials(user?.name || "Anonymous")}</Avatar>
                                    <Flex direction={'column'} className='hidden md:flex max-w-[80%]' align={'flex-start'}>
                                        <Text fw={700} c={!dark ? 'dark' : "gray"}>{user?.name}</Text>
                                        <Text size={'xs'} c={'gray'} className="!break-all text-wrap items-start text-start">{user?.email}</Text>
                                    </Flex>
                                </Flex>
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Application</Menu.Label>
                            <MenuOptions />
                            <Menu.Divider />
                            <Menu.Label>Other</Menu.Label>
                            <Flex className="block md:hidden">
                                {/* {!isAdmin && <Menu.Item
                                    my={10}
                                    leftSection={<Bell stroke={`1.5`} size={20} />}
                                    // onClick={() => navigate("/dashboard/notifications")}
                                    >Notifications</Menu.Item>} */}
                                <Tooltip label={dark ? "Light mode" : "Dark mode"}>
                                    <Menu.Item
                                        onClick={() => toggleColorScheme()}
                                        my={10}
                                        leftSection={
                                            dark ? <Sun size={20} /> : <Moon size={20} />
                                        }>{dark ? "Light mode" : "Dark mode"}</Menu.Item>
                                </Tooltip>
                            </Flex>
                            <Menu.Item
                                my={10}
                                leftSection={<SignOut size={20} stroke={"1.5"} />}
                                onClick={handleLogout}>Logout</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Flex>
                {/* <p>{article.body.slice(0, 20)}...</p> */}
            </Group>
        );
    }

export default DashboardHeader;