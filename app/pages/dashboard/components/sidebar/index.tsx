"use client";
import { useUserContext } from '@/app/context/UserContext';
import { menuData, removeUserToken } from '@/app/utils/helper';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import classes from './styles.module.css';
import { Action_Type } from '@/app/utils/types';
import { SignOut } from '@phosphor-icons/react';


interface Props {
  mobileOpened: boolean,
  toggleMobile: () => void,
}

export default function Sidebar({ mobileOpened, toggleMobile }: Props) {
  const { user, userDispatch } = useUserContext()
  const [active, setActive] = useState('Billing');
  const [userMenuData, setMenuData] = useState(menuData)
  const router = useRouter()

  const pathname = usePathname();

  useEffect(() => {
    setActive(pathname)
  }, [pathname])

  const links = userMenuData.map((item) => (
    <a
      className={classes.link}
      data-active={item.link === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        if (item.link === "#") return;
        router.push(item.link)
        setActive(item.link);
        toggleMobile()
      }}
    >
      <item.icon size={20} className={`${classes.linkIcon} text-white`} stroke='1.5' />
      <span>{item.label}</span>
    </a>
  ));


  const handleLogout = () => {
    removeUserToken()
    userDispatch({
      type: Action_Type.LOGOUT_USER,
      payload: null
    })
    router.push("/pages/login")
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
            <SignOut className={classes.linkIcon} stroke={"1.5"} />
            <span>Logout</span>
          </a>
        </div>
      </nav>
    </>

  );
}