import { GenericCard } from '@/shared/components';
import { ClipboardDocumentList, Clock } from '@/shared/icons';
import { auth } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '~/db';

const Summary = async () => {
  const { userId } = await auth.protect();
  const user = await currentUser();
  if (!user) {
    return <div>No se pudo obtener el usuario</div>;
  }
  const glosses = await db.query.CustomGloss.findMany({
    where: (gloss, { eq }) => eq(gloss.userId, userId),
  });
  const totalTimeSaved = glosses.reduce(
    (sum, gloss) => sum + gloss.timeSaved,
    0
  );
  const totalGlosses = glosses.length;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GenericCard customClass="h-[140px]">
        <div className="flex justify-between gap-1">
          <p
            title={`${(totalTimeSaved / 60).toFixed(2)} horas`}
            className="truncate font-bold text-2xl"
          >
            {(totalTimeSaved / 60).toFixed(2)} horas
          </p>
          <div className="h-full rounded-full bg-blue-100/60 p-3 text-blue-400">
            <Clock />
          </div>
        </div>
        <small>Tiempo Ahorrado</small>
      </GenericCard>
      <GenericCard customClass="h-[140px]">
        <div className="flex justify-between gap-1">
          <p title={`${totalGlosses}`} className="truncate font-bold text-2xl">
            {totalGlosses}
          </p>
          <div className="h-full rounded-full bg-green-100/60 p-3 text-green-400">
            <ClipboardDocumentList />
          </div>
        </div>
        <small>Glosas Realizadas</small>
      </GenericCard>
    </div>
  );
};

export default Summary;
