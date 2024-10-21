// "use client";

import Bell from "@/public/icons/Bell";
import { useModal } from "@/app/hooks";

interface INotificationsMenu {
  notifications: object;
}

const NotificationsMenu = ({ notifications }: INotificationsMenu) => {
  console.log(notifications);
  const { isOpen, toggleMenu, menuRef } = useModal();

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button type="button" onClick={toggleMenu} className="flex items-center">
        <Bell isFilled />
      </button>
      {isOpen && (
        <div
          aria-roledescription="menu"
          className="z-20 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow"
        >
          {/* ALL NOTIFICATIONS */}
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
