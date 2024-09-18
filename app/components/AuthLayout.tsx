import { Container, Flex, Paper } from "@mantine/core";
import { ReactNode } from "react";
import Logo from "./Logo";


interface AuthLayoutProps {
    children: ReactNode, 
    bottomContent?: ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, bottomContent }) => {
    return (
        <Flex direction={"column"} h={"100vh"} p={0} m={0} justify={"space-between"}>
            <Container
                size={"xl"}
                my={"auto"}
                className='w-[100%]'
            >
                <Flex my={"auto"} direction={"column"} justify={"center"} mx={"auto"} h={"100%"} align={"center"}>
                    <Paper withBorder p={30} mt={30} radius="sm" maw={400} w={"100%"}>
                        <Logo />
                        {children}
                    </Paper>
                    {bottomContent &&
                        <Paper withBorder p={10} my={10} radius="sm" maw={400} w={"100%"}>
                            {bottomContent}
                        </Paper>}
                </Flex>
            </Container>
        </Flex>
    );
}

export default AuthLayout;