// "use client";

import { useModal } from '@/shared/hooks';
import Bell from '@/shared/icons/Bell';

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
          className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md shadow"
        >
          {/* ALL NOTIFICATIONS */}
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
