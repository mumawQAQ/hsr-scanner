'use client';
import { Navbar as NextUINavbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import React from 'react';
import { PathType, usePath } from '@/app/hooks/use-path-store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const { path, setPath } = usePath();

  const handlePathChange = (type: PathType) => {
    router.push(type);
    setPath(type);
  };

  return (
    <NextUINavbar>
      <NavbarContent justify="start"></NavbarContent>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
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
      <NavbarContent justify="end"></NavbarContent>
    </NextUINavbar>
  );
}
