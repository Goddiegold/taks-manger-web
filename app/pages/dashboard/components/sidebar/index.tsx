
"use client";
import { useEffect, useState } from 'react';
import classes from './styles.module.css';

// import { IoMdLogOut } from 'react-icons/io';
// import { menuData, removeUserToken } from '@/shared/helpers';
// import { useUserContext } from '@/context/UserContext';
// import { Action_Type, user_role } from '@/shared/types';
import { BuildingOffice, Handshake, Wallet } from '@phosphor-icons/react';
import { menuData, removeUserToken } from '@/app/utils/helper';
import { useRouter } from 'next/navigation';
// import { useLocation } from 'react-router-dom';
// import useNavigation from '@/hooks/useNavigation';

export default function Sidebar() {
  //   const { user, userDispatch } = useUserContext()
  const [active, setActive] = useState('Billing');
  const [userMenuData, setMenuData] = useState(menuData)
  const router = useRouter()
  //   const navigate = useNavigation()
  //   const { pathname } = useLocation()


  //   useEffect(() => {
  //     const copyData = [...menuData];
  //     let position: number = 0;
  //     let newItem: any[];

  //     if (user?.role === user_role.vendor) {
  //       position = 1;
  //       newItem = [
  //         {
  //           link: '/dashboard/wallet',
  //           label: 'Wallet',
  //           icon: Wallet
  //         },
  //       ]
  //     }

  //     if (user?.role === user_role.company || user?.role === user_role.admin) {
  //       position = 1;
  //       newItem = [
  //         {
  //           link: "/dashboard/registered-vendors",
  //           label: "Vendors",
  //           icon: Handshake
  //         },
  //       ]

  //       if (user?.role === user_role.admin) {
  //         newItem = [
  //           {
  //             link: "/dashboard/registered-companies",
  //             label: "Companies",
  //             icon: BuildingOffice
  //           },
  //           ...newItem
  //         ]
  //       }
  //     }

  //     if (newItem) {
  //       copyData.splice(position, 0, ...newItem)
  //     }
  //     setMenuData(copyData)
  //   }, [user]);

  //   useEffect(() => {
  //     const urlPaths = pathname.split('/');
  //     console.log("urlPaths", urlPaths)
  //     const currentPath = urlPaths[2] ? `/${urlPaths[1]}/${urlPaths[2]}` : `/${urlPaths[1]}`
  //     setActive(currentPath)
  //   }, [pathname])

  const links = userMenuData.map((item) => (
    <a
      className={classes.link}
      data-active={item.link === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        // navigate(item.link)
        router.push(item.link)
        setActive(item.link);
      }}
    >
      {/* {item.icon} */}
      <item.icon size={20} className={`${classes.linkIcon} text-white`} stroke='1.5' />
      <span>{item.label}</span>
    </a>
  ));


  const handleLogout = () => {
    removeUserToken()
    // userDispatch({
    //   type: Action_Type.LOGOUT_USER,
    //   payload: null
    // })
    // navigate(user?.role === user_role.vendor ? `/${user?.company?.slug}/login` : "/login")
  }

  return (
    <>
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          {links}
        </div>

        <div className={classes.footer}>

          <a
            href="#"
            className={classes.link}
            onClick={(event) => {
              event.preventDefault()
              handleLogout()
            }}>
            {/* <IconLogout className={classes.linkIcon} stroke={1.5} /> */}
            {/* <IoMdLogOut className={classes.linkIcon} stroke={`1.5`} /> */}
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </>

  );
}