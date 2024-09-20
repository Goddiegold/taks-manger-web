"use client";
import React, {
    createContext,
    useReducer, useContext,
    ReactNode,
} from 'react';
import { Action_Type, User, UserContextType } from '@/app/utils/types';
import { useQuery } from '@tanstack/react-query';
import { removeUserToken, TASK_MANAGER_USER_TOKEN, toast, userToken } from '../utils/helper';
import { useClient } from '../utils/client';
// import AppLoader from '../components/AppLoader';
import dynamic from 'next/dynamic'
 
const AppLoader = dynamic(() => import('../components/AppLoader'), { ssr: false })

const UserContext = createContext<UserContextType>({});


const userReducer = (state: any, action: { payload?: any, type: Action_Type }) => {
    switch (action.type) {
        case Action_Type.USER_PROFILE:
            localStorage.setItem(TASK_MANAGER_USER_TOKEN,
                action.payload?.token || state?.token)
            return {
                ...state, ...action.payload,
                isLoggedIn: true
            };
        case Action_Type.LOGOUT_USER:
            removeUserToken()
            return null;
        default:
            return null
    }
}

const UserContextProvider = ({ children }: { children: ReactNode }) => {

    //user info
    const [user, userDispatch] = useReducer(userReducer, null, function () { })

    const contextValue: UserContextType = {
        user,
        isLoggedIn: user?.isLoggedIn,
        userDispatch: userDispatch as React.Dispatch<{ payload?: any; type: Action_Type }>,
    };

    const client = useClient()

    const token = userToken()

    const { data, isLoading } = useQuery({
        queryKey: ["currentuserprofile"],
        queryFn: async () => {
            try {
                const res = await client().get("/auth/profile")
                return res.data?.result as User
            } catch (err) {
                userDispatch({
                    type: Action_Type.LOGOUT_USER,
                })
                if (!userToken()) {
                    toast(err?.response?.data?.message).error()
                }
            }
        },
        enabled: !!userToken() && !user?.name
    })

    if (data && !user?.name) {
        userDispatch({
            type: Action_Type.USER_PROFILE,
            payload: { ...data as User, token }
        })
    }



    return (
        <UserContext.Provider value={contextValue}>
            {isLoading ? <AppLoader /> : <>{children}</>}
            {/* {children} */}
        </UserContext.Provider>
    )

}

export default UserContextProvider;


export const useUserContext = () => useContext(UserContext);