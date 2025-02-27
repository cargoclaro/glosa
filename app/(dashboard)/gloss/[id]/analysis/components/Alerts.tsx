import { cn } from "@/app/shared/utils/cn";
import { GenericCard } from "@/app/shared/components";
import { BellAlert, XMark } from "@/app/shared/icons";
import ExclamationTriangle from "@/app/shared/icons/ExclamationTriangle";
import { CustomGlossAlert } from "@prisma/client";

const Alerts = ({ data }: { data: CustomGlossAlert[] }) => {
  return (
    <GenericCard customClass="">
      <h1 className="flex justify-center items-center gap-2 font-semibold pb-2 border-b border-black">
        <BellAlert />
        Alertas
      </h1>
      <ul className="mt-4 flex flex-col gap-4 max-h-[250px] overflow-auto">
        {data.map((alert) => (
          <li
            key={alert.id}
            title={alert.description}
            className={cn(
              "flex items-center gap-2 rounded-e-full p-2 border border-l-2 text-sm",
              alert.type === "HIGH"
                ? "bg-red-100/50 border-red-500 text-red-500 "
                : "bg-yellow-100/50 border-yellow-500 text-yellow-500"
            )}
          >
            {alert.type === "HIGH" ? <XMark /> : <ExclamationTriangle />}
            <span className="text-black truncate">{alert.description}</span>
          </li>
        ))}
      </ul>
    </GenericCard>
  );
};

export default Alerts;
