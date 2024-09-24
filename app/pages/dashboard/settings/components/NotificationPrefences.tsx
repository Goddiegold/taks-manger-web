
"use client";

import { useUserContext } from "@/app/context/UserContext";
import { Button, Flex, Group, Switch } from "@mantine/core";
import { useEffect, useState } from "react";
import { toast } from "@/app/utils/helper";
import { useClient } from "@/app/utils/client";
import { Action_Type } from "@/app/utils/types";

const NotificationPrefences = () => {
    const { user, userDispatch } = useUserContext()
    const [value, setValue] = useState<string[]>([]);
    const [loading, setLoading] = useState(false)
    const client = useClient()

    useEffect(() => {
        const notifications = [];

        if (user?.emailNotification) {
            notifications.push("email");
        }

        if (user?.pushNotification) {
            notifications.push("push");
        }

        setValue(prevValue => [...prevValue, ...notifications]);
    }, [user]);

    const handleUpdate = async () => {
        try {
            if (value.length === 0) {
                return toast("Plese check at least one prefence!").error()
            }
            setLoading(true)
            const pushNotification = value.includes("push")
            const emailNotification = value.includes("email")
            await client().put("/users/notification-pref", { pushNotification, emailNotification })
            userDispatch({
                type: Action_Type.USER_PROFILE,
                payload: { pushNotification, emailNotification }
            })
            setLoading(false)
            toast("Updated susccessfullly!").success()
        } catch (error) {
            setLoading(false)
            //@ts-ignore
            toast(error?.response?.data?.message).error()
        }
    }

    return (
        <Flex my={"md"} className="flex-col">
            <Switch.Group
                // defaultValue={['react']}
                value={value}
                onChange={setValue}
                label="Select your preferred notification style"
            // description="This is anonymous"
            // withAsterisk
            >
                <Group mt="xs">
                    <Switch value="email" label="Email notification" />
                    <Switch value="push" label="Real time notification" />
                </Group>
            </Switch.Group>
            <Button
            loading={loading}
                size="xs"
                disabled={value.length === 0}
                maw={100}
                onClick={handleUpdate} mt={"md"}>Update</Button>

        </Flex>
    );
}

export default NotificationPrefences;