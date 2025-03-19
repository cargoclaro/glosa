import { db } from '~/db';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { GlossDataTable, GlossDataTableColumns } from './components';

export const metadata: Metadata = {
  title: 'Operaciones',
};

const GlossPage = async () => {
  const { userId } = await auth.protect();
  const myGlosses = await db.query.CustomGloss.findMany({
    where: (gloss, { eq }) => eq(gloss.userId, userId),
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
