import { GenericCard } from '@/shared/components';
import { BellAlert, XMark } from '@/shared/icons';
import ExclamationTriangle from '@/shared/icons/ExclamationTriangle';
import { cn } from '@/shared/utils/cn';
import type { CustomGlossAlert } from '@prisma/client';

const Alerts = ({ data }: { data: CustomGlossAlert[] }) => {
  return (
    <GenericCard customClass="">
      <h1 className="flex items-center justify-center gap-2 border-black border-b pb-2 font-semibold">
        <BellAlert />
        Alertas
      </h1>
      <ul className="mt-4 flex max-h-[250px] flex-col gap-4 overflow-auto">
        {data.map((alert) => (
          <li
            key={alert.id}
            title={alert.description}
            className={cn(
              'flex items-center gap-2 rounded-e-full border border-l-2 p-2 text-sm',
              alert.type === 'HIGH'
                ? 'border-red-500 bg-red-100/50 text-red-500 '
                : 'border-yellow-500 bg-yellow-100/50 text-yellow-500'
            )}
          >
            {alert.type === 'HIGH' ? <XMark /> : <ExclamationTriangle />}
            <span className="truncate text-black">{alert.description}</span>
          </li>
        ))}
      </ul>
    </GenericCard>
  );
};

export default Alerts;
