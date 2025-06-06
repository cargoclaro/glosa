'use client';

import { Modal } from '@/shared/components';
import { useModal } from '@/shared/hooks';
import GlossForm from './gloss-form';

const Header = () => {
  const { isOpen, openMenu, closeMenu, menuRef } = useModal(false);
  return (
    <section className="flex justify-between gap-2">
      <h1 className="font-bold text-2xl">Dashboard de Glosa Aduanal</h1>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            const dropdown = document.getElementById('glosa-dropdown');
            dropdown?.classList.toggle('hidden');
          }}
          className="flex items-center rounded-md border border-white bg-primary px-12 py-2 text-sm text-white shadow-black/50 shadow-md hover:bg-primary/80"
        >
          Nueva Glosa
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <div
          id="glosa-dropdown"
          className="absolute right-0 z-10 mt-2 hidden w-64 rounded-md bg-white shadow-lg"
        >
          <ul className="py-1">
            <li>
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById('glosa-dropdown')
                    ?.classList.add('hidden');
                  openMenu();
                }}
                className="block w-full px-4 py-2 text-left text-gray-700 text-sm hover:bg-gray-100"
              >
                Glosa Regular
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeMenu} menuRef={menuRef}>
        <GlossForm />
      </Modal>
    </section>
  );
};

export default Header;
