"use client";

import formatCurrency from "@/app/utils/format-currency";
import { GenericCard, SummaryCardSkeleton } from "@/app/components";
import {
  Clock,
  CalendarDays,
  CurrencyDollar,
  ClipboardDocumentList,
} from "@/public/icons";
import { useAuth } from "@/app/hooks";

const Summary = () => {
  const { user } = useAuth();
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {user ? (
        <>
          <GenericCard customClass="h-[140px]">
            <div className="flex justify-between gap-1">
              <p
                title={formatCurrency(520000, "MXN")}
                className="text-2xl font-bold truncate"
              >
                {formatCurrency(520000, "MXN")}
              </p>
              <div className="h-full p-3 rounded-full bg-yellow-100/60 text-yellow-400">
                <CurrencyDollar />
              </div>
            </div>
            <small>Ahorrado en multas</small>
          </GenericCard>
          <GenericCard customClass="h-[140px]">
            <div className="flex justify-between gap-1">
              <p title="4,599 Horas" className="text-2xl font-bold truncate">
                4,599 Horas
              </p>
              <div className="h-full p-3 rounded-full bg-blue-100/60 text-blue-400">
                <Clock />
              </div>
            </div>
            <small>Tiempo Ahorrado</small>
          </GenericCard>
          <GenericCard customClass="h-[140px]">
            <div className="flex justify-between gap-1">
              <p title="6,000" className="text-2xl font-bold truncate">
                6,000
              </p>
              <div className="h-full p-3 rounded-full bg-green-100/60 text-green-400">
                <ClipboardDocumentList />
              </div>
            </div>
            <small>Glosas Mensuales</small>
          </GenericCard>
          <GenericCard customClass="h-[140px]">
            <div className="flex justify-between gap-1">
              <p title="2 años" className="text-2xl font-bold truncate">
                2 años
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
