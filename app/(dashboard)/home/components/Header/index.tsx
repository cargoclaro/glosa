const Header = () => {
  return (
    <section className="flex justify-between gap-2">
      <h1 className="text-2xl font-bold">Dashboard de Glosa Aduanal</h1>
      <button className="px-12 py-2 rounded-md shadow-black/50 shadow-md text-white bg-cargoClaroOrange hover:bg-cargoClaroOrange-hover border border-white text-sm">
        Nueva Glosa
      </button>
    </section>
  );
};

export default Header;
