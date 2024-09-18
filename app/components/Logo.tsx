import { Flex, Text, Image, Space } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter()
    return (
        <Link href={"/"}>
            <Flex align={'center'} justify={'center'} className="">
                <div className="w-[23px] h-[23px] justify-center flex rounded-lg bg-[var(--mantine-primary-color-filled)]">
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