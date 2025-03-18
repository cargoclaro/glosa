import { GenericCard } from "@/shared/components";
import {
  Clock,
  CalendarDays,
  ClipboardDocumentList,
} from "@/shared/icons";
import { getTimePassed } from "@/shared/utils/get-time-passed";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/shared/services/prisma";
import { currentUser } from "@clerk/nextjs/server";

const Summary = async () => {
  const { userId } = await auth.protect();
  const user = await currentUser();
  if (!user) {
    return <div>No se pudo obtener el usuario</div>;
  }
  const glosses = await prisma.customGloss.findMany({
    where: {
      userId,
    },
  });
  const totalTimeSaved = glosses.reduce((sum, gloss) => sum + gloss.timeSaved, 0);
  const totalGlosses = glosses.length;

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <GenericCard customClass="h-[140px]">
        <div className="flex justify-between gap-1">
          <p
            title={`${(totalTimeSaved / 60).toFixed(2)} horas`}
            className="text-2xl font-bold truncate"
          >
            {(totalTimeSaved / 60).toFixed(2)} horas
          </p>
          <div className="h-full p-3 rounded-full bg-blue-100/60 text-blue-400">
            <Clock />
          </div>
        </div>
        <small>Tiempo Ahorrado</small>
      </GenericCard>
      <GenericCard customClass="h-[140px]">
        <div className="flex justify-between gap-1">
          <p
            title={`${totalGlosses}`}
            className="text-2xl font-bold truncate"
          >
            {totalGlosses}
          </p>
          <div className="h-full p-3 rounded-full bg-green-100/60 text-green-400">
            <ClipboardDocumentList />
          </div>
        </div>
        <small>Glosas Realizadas</small>
      </GenericCard>
      <GenericCard customClass="h-[140px]">
        <div className="flex justify-between gap-1">
          <p
            title={`${getTimePassed({ pastDate: new Date(user.createdAt) })}`}
            className="text-2xl font-bold truncate"
          >
            {getTimePassed({ pastDate: new Date(user.createdAt) })}
          </p>
          <div className="h-full p-3 rounded-full bg-purple-100/60 text-purple-400">
            <CalendarDays />
          </div>
        </div>
        <small>Trabajando Juntos</small>
      </GenericCard>
    </div>
  );
};

export default Summary;
