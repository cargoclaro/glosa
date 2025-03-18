import prisma from '@/shared/services/prisma';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { GlossDataTable, GlossDataTableColumns } from './components';

export const metadata: Metadata = {
  title: 'Operaciones',
};

const GlossPage = async () => {
  const { userId } = await auth.protect();
  const myGlosses = await prisma.customGloss.findMany({
    where: { userId },
  });
  if (!myGlosses) {
    return <div>No se encontraron operaciones</div>;
  }
  const data = myGlosses.map((gloss) => ({
    id: gloss.id,
    importerName: gloss.importerName,
    operationStatus: gloss.operationStatus,
  }));
  return (
    <article>
      <GlossDataTable data={data} columns={GlossDataTableColumns} />
    </article>
  );
};

export default GlossPage;
