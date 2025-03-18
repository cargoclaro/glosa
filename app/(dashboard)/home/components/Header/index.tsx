"use client";

import GlossForm from "./GlossForm";
import GlossFormRemesa from "./GlossFormRemesa";
import { Modal } from "@/shared/components";
import { useModal } from "@/shared/hooks";

const Header = () => {
  const { isOpen, openMenu, closeMenu, menuRef } = useModal(false);
  const { 
    isOpen: isRemesaOpen, 
    openMenu: openRemesaMenu, 
    closeMenu: closeRemesaMenu, 
    menuRef: remesaMenuRef 
  } = useModal(false);
  return (
    <section className="flex justify-between gap-2">
      <h1 className="text-2xl font-bold">Dashboard de Glosa Aduanal</h1>
      <div className="relative">
        <button
          onClick={() => {
            const dropdown = document.getElementById("glosa-dropdown");
            dropdown?.classList.toggle("hidden");
          }}
          className="px-12 py-2 rounded-md shadow-black/50 shadow-md text-white bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover border border-white text-sm flex items-center"
        >
          Nueva Glosa
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div id="glosa-dropdown" className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 hidden">
          <ul className="py-1">
            <li>
              <button
                onClick={() => {
                  document.getElementById("glosa-dropdown")?.classList.add("hidden");
                  openMenu();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Glosa Regular
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  document.getElementById("glosa-dropdown")?.classList.add("hidden");
                  openRemesaMenu();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Glosa de Remesa de Exportación
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeMenu} menuRef={menuRef}>
        <GlossForm />
      </Modal>
      <Modal isOpen={isRemesaOpen} onClose={closeRemesaMenu} menuRef={remesaMenuRef}>
        <GlossFormRemesa />
      </Modal>
    </section>
  );
};

export default Header;
