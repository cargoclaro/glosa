import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { db } from '~/db';
import { GlossHistory, Header, MexMap, MyInfo, Summary } from './components';

export const metadata: Metadata = {
  title: 'Administración',
};

const HomePage = async () => {
  const { userId } = await auth.protect();
  const myLatestGlosses = await db.query.CustomGloss.findMany({
    where: (gloss, { eq }) => eq(gloss.userId, userId),
    orderBy: (gloss, { desc }) => [desc(gloss.updatedAt)],
    limit: 3,
  });
  if (!myLatestGlosses) {
    return <div>No hay glosas recientes</div>;
  }
  return (
    <article>
      <Header />
      <section className="mt-6 flex flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <MyInfo />
          <MexMap />
        </div>
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <Summary />
          <GlossHistory history={myLatestGlosses} />
        </div>
      </section>
    </article>
  );
};

export default HomePage;
