"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const useModal = (initialState = false) => {
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(initialState);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      menuRef.current &&
      !(menuRef.current as HTMLElement).contains(event.target as Node)
    ) {
      closeMenu();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return { isOpen, toggleMenu, openMenu, closeMenu, menuRef };
};

export default useModal;
