"use client";
import ListingCard from "../components/cards/ListingCard";
import { Tabs, rem } from '@mantine/core';
import NotificationPrefences from "./components/NotificationPrefences";
import { Bell } from "@phosphor-icons/react";

const Settings = () => {
    return (
        <ListingCard>
            <Tabs defaultValue="notification">
                <Tabs.List>
                    <Tabs.Tab value="notification"
                    leftSection={<Bell size={20} />}
                    >
                        Notification preference
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="notification">
                    <NotificationPrefences />
                </Tabs.Panel>

            </Tabs>
        </ListingCard>
    );
}

export default Settings;