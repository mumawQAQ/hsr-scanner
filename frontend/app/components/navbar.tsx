'use client';
import { Navbar as NextUINavbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import React from 'react';
import { PathType, usePath } from '@/app/hooks/use-path-store';
import { useRouter } from 'next/navigation';
import { useNavbarStore } from '@/app/hooks/use-navbar-store';
import useWindowStore from '@/app/hooks/use-window-store';

export default function Navbar() {
  const router = useRouter();
  const { path, setPath } = usePath();
  const { isLightMode } = useWindowStore();
  const { leftNavbar, rightNavbar, clearCustomNavbar } = useNavbarStore();

  const handlePathChange = (type: PathType) => {
    clearCustomNavbar();
    router.push(type);
    setPath(type);
  };

  if (isLightMode) {
    return null;
  }

  return (
    <NextUINavbar>
      <NavbarContent justify="start">{leftNavbar}</NavbarContent>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem isActive={path === '/dashboard/setting'}>
          <div
            className="cursor-pointer"
            onClick={() => {
              handlePathChange('/dashboard/setting');
            }}
          >
            设置
          </div>
        </NavbarItem>
        <NavbarItem isActive={path === '/dashboard/relic-panel'}>
          <div
            className="cursor-pointer"
            onClick={() => {
              handlePathChange('/dashboard/relic-panel');
            }}
          >
            扫描器
          </div>
        </NavbarItem>
        <NavbarItem isActive={path === '/dashboard/relic-templates'}>
          <div
            className="cursor-pointer"
            onClick={() => {
              handlePathChange('/dashboard/relic-templates');
            }}
          >
            模板管理
          </div>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">{rightNavbar}</NavbarContent>
    </NextUINavbar>
  );
}
