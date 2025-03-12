"use client";

import GlossForm from "./GlossForm";
import GlossFormRemesa from "./GlossFormRemesa";
import { Modal } from "@/app/shared/components";
import { useModal } from "@/app/shared/hooks";

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
      <button
        onClick={openMenu}
        className="px-12 py-2 rounded-md shadow-black/50 shadow-md text-white bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover border border-white text-sm"
      >
        Nueva Glosa
      </button>
      <Modal isOpen={isOpen} onClose={closeMenu} menuRef={menuRef}>
        <GlossForm />
      </Modal>
      <button
        onClick={openRemesaMenu}
        className="px-12 py-2 rounded-md shadow-black/50 shadow-md text-white bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover border border-white text-sm"
      >
        Nueva Glosa de Remesa de Exportación
      </button>
      <Modal isOpen={isRemesaOpen} onClose={closeRemesaMenu} menuRef={remesaMenuRef}>
        <GlossFormRemesa />
      </Modal>
    </section>
  );
};

export default Header;
