"use client";

import { notifications } from "@mantine/notifications";
import { Gear, ShoppingCart, SquaresFour } from "@phosphor-icons/react";

export const toast = (message: string, title?: string) => {
    return {
        success: () => notifications.show({
            color: "green",
            title: title ? title : 'Success',
            message,
            withBorder: true,
            // autoClose: 5000
        }),
        error: () => notifications.show({
            color: "red",
            title: title ? title : 'Failed',
            message: message ?? "Something went wrong!",
            withBorder: true,
        })
    }
}

export const TASK_MANAGER_USER_TOKEN = 'TASK_MANAGER_USER_TOKEN';
export const removeUserToken = () => typeof window !== "undefined" ? localStorage.removeItem(TASK_MANAGER_USER_TOKEN) : null;
export const userToken = () => typeof window !== "undefined"?localStorage.getItem(TASK_MANAGER_USER_TOKEN):null


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
    {
        link: '/dashboard',
        label: 'Dashboard',
        icon: SquaresFour
    },
    {
        link: '/dashboard/tasks',
        label: 'Task Managment',
        icon: ShoppingCart
    },
    {
        link: '/dashboard/projects',
        label: 'Project Management',
        icon: Gear
    },
    {
        link: '/dashboard/team',
        label: 'Team Management',
        icon: Gear
    },
    {
        link: '/dashboard',
        label: 'Settings',
        icon: Gear
    },
];
