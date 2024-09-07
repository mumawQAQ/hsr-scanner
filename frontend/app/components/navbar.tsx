'use client';
import {
  Link,
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { PathType, usePath } from '@/app/hooks/use-path-store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const { path, setPath } = usePath();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = ['扫描器', '模板管理'];

  const handlePathChange = (type: PathType) => {
    router.push(type);
    setPath(type);
  };

  return (
    <NextUINavbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
      </NavbarContent>

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
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={index === 2 ? 'primary' : index === menuItems.length - 1 ? 'danger' : 'foreground'}
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
}
