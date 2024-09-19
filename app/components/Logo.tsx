import { Flex, Text, Space } from "@mantine/core";
import Link from "next/link";

const Logo = () => {
    return (
        <Link href={"/"}>
            <Flex align={'center'} justify={'center'} className="">
                <div className="w-[23px] h-[23px] justify-center flex rounded-md bg-primary">
                </div>
                <Space mx={3} />
                <Text fw={600} size='lg'
                    className='font-inter'>Task Manager</Text>
            </Flex>
            <div></div>
        </Link>
    );
}

export default Logo;