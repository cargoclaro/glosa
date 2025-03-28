import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { db } from '~/db';
import {
  DailyGlossesGraph,
  GlossHistory,
  Header,
  MyInfo,
  Summary,
} from './components';

export const metadata: Metadata = {
  title: 'Administración',
};

const HomePage = async () => {
  const { userId } = await auth.protect();
  const myLatestGlosses = await db.query.CustomGloss.findMany({
    where: (gloss, { eq }) => eq(gloss.userId, userId),
    orderBy: (gloss, { desc }) => [desc(gloss.createdAt)],
    limit: 6,
  });

  // Get all glosses for the graph (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const allGlosses = await db.query.CustomGloss.findMany({
    where: (gloss, { and, eq, gte }) =>
      and(eq(gloss.userId, userId), gte(gloss.createdAt, thirtyDaysAgo)),
    orderBy: (gloss, { desc }) => [desc(gloss.createdAt)],
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
          <Summary />
          <DailyGlossesGraph glosses={allGlosses} />
        </div>
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <GlossHistory history={myLatestGlosses} />
        </div>
      </section>
    </article>
  );
};

export default HomePage;
