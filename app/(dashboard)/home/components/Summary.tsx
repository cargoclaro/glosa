"use client";

import formatCurrency from "@/app/shared/utils/format-currency";
import { GenericCard, SummaryCardSkeleton } from "@/app/shared/components";
import {
  Clock,
  CalendarDays,
  CurrencyDollar,
  ClipboardDocumentList,
} from "@/app/shared/icons";
import { useAuth } from "@/app/shared/hooks";
import { getTimePassed } from "@/app/shared/utils/get-time-passed";

const Summary = () => {
  const { user } = useAuth();

  const totalMoneySaved =
    user?.glosses.reduce((sum, gloss) => sum + gloss.moneySaved, 0) || 0;
  const totalTimeSaved =
    user?.glosses.reduce((sum, gloss) => sum + gloss.timeSaved, 0) || 0;
  const totalGlosses = user?.glosses.length ? user.glosses.length : 0;

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {user ? (
        <>
          <GenericCard customClass="h-[140px]">
            <div className="flex justify-between gap-1">
              <p
                title={formatCurrency(totalMoneySaved, "MXN")}
                className="text-2xl font-bold truncate"
              >
                {formatCurrency(totalMoneySaved, "MXN")}
              </p>
              <div className="h-full p-3 rounded-full bg-yellow-100/60 text-yellow-400">
                <CurrencyDollar />
              </div>
            </div>
            <small>Ahorrado en multas</small>
          </GenericCard>
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
                title={`${getTimePassed({ pastDate: user.createdAt })}`}
                className="text-2xl font-bold truncate"
              >
                {getTimePassed({ pastDate: user.createdAt })}
              </p>
              <div className="h-full p-3 rounded-full bg-purple-100/60 text-purple-400">
                <CalendarDays />
              </div>
            </div>
            <small>Trabajando Juntos</small>
          </GenericCard>
        </>
      ) : (
        <>
          {Array.from({ length: 4 }).map((_, index) => (
            <SummaryCardSkeleton key={index} />
          ))}
        </>
      )}
    </div>
  );
};

export default Summary;
