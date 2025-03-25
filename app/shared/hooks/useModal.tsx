'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const useModal = (initialState = false) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(initialState);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!(event.target instanceof Node)) { return; }

    if (menuRef.current && !menuRef.current.contains(event.target)) {
      closeMenu();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return { isOpen, toggleMenu, openMenu, closeMenu, menuRef };
};

export default useModal;
