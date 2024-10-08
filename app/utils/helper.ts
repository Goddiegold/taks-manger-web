"use client";

import { notifications } from "@mantine/notifications";
import { Gear, Notebook, Notepad, ShoppingCart, SquaresFour } from "@phosphor-icons/react";
import { io } from "socket.io-client";
import { User } from "./types";
import { NotificationPosition } from "@mantine/notifications/lib/notifications.store";

export const toast = (message: string, title?: string, position?: NotificationPosition) => {
    return {
        success: () => notifications.show({
            color: "green",
            title: title ? title : 'Success',
            message,
            withBorder: true,
            position
            // autoClose: 5000
        }),
        error: () => notifications.show({
            color: "red",
            title: title ? title : 'Failed',
            message: message ?? "Something went wrong!",
            withBorder: true,
            position
        })
    }
}

export const TASK_MANAGER_USER_TOKEN = 'TASK_MANAGER_USER_TOKEN';
export const removeUserToken = () => typeof window !== "undefined" ? localStorage.removeItem(TASK_MANAGER_USER_TOKEN) : null;
export const userToken = () => typeof window !== "undefined" ? localStorage.getItem(TASK_MANAGER_USER_TOKEN) : null


export function getInitials(name: string) {
    if (!name) return;
    const firstName = name.toUpperCase()?.split(" ")[0]
    const lastName = name.toUpperCase()?.split(" ")[1]
    if (firstName && lastName) return firstName[0] + lastName[0];
    return firstName[0] + firstName[1]
}

export function truncateString(str: string, maxLength = 22) {
    if (!str) return
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    } else {
        return str;
    }
}

export function truncateStringAtMiddle(text: string, maxLength: number) {
    if (!text) return null;
    // If the text length is less than or equal to the max length, return the original text
    if (text.length <= maxLength) {
        return text;
    }

    // Calculate how many characters to show from the start and end
    const partLength = Math.floor((maxLength - 3) / 2);

    // Get the start and end parts of the text
    const start = text.substring(0, partLength);
    const end = text.substring(text.length - partLength);

    // Return the truncated text with ellipsis in the middle
    return `${start}...${end}`;
}


export const menuData = [
    // {
    //     // link: '/pages/dashboard',
    //     link: '#',
    //     label: 'Dashboard',
    //     icon: SquaresFour
    // },
    {
        link: '/pages/dashboard/projects',
        label: 'Project Management',
        icon: Notebook
    },
    {
        link: '/pages/dashboard/tasks',
        label: 'Task Managment',
        icon: Notepad
    },
    // {
    //     link: '/pages/dashboard/team',
    //     label: 'Team Management',
    //     icon: Gear
    // },
    {
        link: '/pages/dashboard/settings',
        label: 'Settings',
        icon: Gear
    },
];

export const connectWithSocketIOServer = (user: User) => {
    // let socket: Socket;
    const socket = io("http://localhost:5000", {
        // reconnection: true,
        // retries: 5,
        // autoConnect: true
    });

    socket.on("connect", () => {
        console.log("successfully connected with socket io server");

        console.log(user.id);


        socket.emit("user-connected", {
            userId: user?.id,
            prevSocketId: user?.socketId
        }, err => {
            if (err) {
                // the server did not acknowledge the event in the given delay
                console.log("err", err);
            }
        })
    });

    socket.on("message", (data) => {
        toast(data?.message, undefined,).success()
    })

    return socket;
};  