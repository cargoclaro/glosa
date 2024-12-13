import { getMyAnalysisById } from "@/app/shared/services/customGloss/controller";
import {
  // Alerts,
  Analysis,
  Pediment,
  Documents,
  SavedNFinish,
} from "./components";
import type { Metadata } from "next";
import { ICustomGloss } from "@/app/shared/interfaces";
import { notFound } from "next/navigation";

type IDynamicMetadata = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: IDynamicMetadata): Promise<Metadata> {
  const id = (await params).id;

  return {
    title: `Análisis de Glosa ${id}`,
  };
}

const GlossIdAnalysis = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const customGloss = (await getMyAnalysisById(id)) as ICustomGloss;
  if (!customGloss) notFound();

  const pedimentNum = {
    number: customGloss.pedimentNum.number,
    status: customGloss.pedimentNum.status,
    anio: customGloss.pedimentNum.anio,
    isVerified: customGloss.pedimentNum.isVerified,
  };
  const operationType = {
    status: customGloss.operationType.status,
    data: customGloss.operationType.data,
    isVerified: customGloss.operationType.isVerified,
    appendices: customGloss.operationType.appendices,
  };
  const destinationOrigin = {
    status: customGloss.destinationOrigin.status,
    destinationOriginKey: customGloss.destinationOrigin.destinationOriginKey,
    appendixValidator: customGloss.destinationOrigin.appendixValidator,
    isVerified: customGloss.destinationOrigin.isVerified,
    appendices: customGloss.destinationOrigin.appendices,
  };
  const operation = {
    status: customGloss.operation.status,
    isVerified: customGloss.operation.isVerified,
    calculations: customGloss.operation.calculations,
  };
  const grossWeight = {
    status: customGloss.grossWeight.status,
    isVerified: customGloss.grossWeight.isVerified,
    calculations: customGloss.grossWeight.calculations,
  };
  const invoiceData = {
    status: customGloss.invoiceData.status,
    isVerified: customGloss.invoiceData.isVerified,
    importerExporter: customGloss.invoiceData.importerExporter,
    supplierBuyer: customGloss.invoiceData.supplierBuyer,
  };
  const transportData = {
    status: customGloss.transportData.status,
    type: customGloss.transportData.type,
    isVerified: customGloss.transportData.isVerified,
    data: customGloss.transportData.data,
  };
  const certification = {
    status: customGloss.certification.status,
    isVerified: customGloss.certification.isVerified,
    taxes: customGloss.certification.taxes,
    restrictionsRegulations: customGloss.certification.restrictionsRegulations,
  };

  return (
    <article className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <section className="flex flex-col gap-4">
        {/* <Alerts data={customGloss.alerts} /> */}
        <Documents data={customGloss.files} />
      </section>
      <section className="sm:col-span-2">
        <Pediment
          document={
            customGloss.files.find((doc) =>
              doc.name === "PEDIMENTO" ? doc : null
            )?.url || ""
          }
        />
      </section>
      <section className="flex flex-col gap-4 col-span-1 sm:col-span-3 lg:col-span-1">
        <Analysis
          pedimentNum={pedimentNum}
          operationType={operationType}
          destinationOrigin={destinationOrigin}
          operation={operation}
          grossWeight={grossWeight}
          invoiceData={invoiceData}
          transportData={transportData}
          partidas={certification}
        />
        <SavedNFinish
          glossId={customGloss.id}
          moneySaved={customGloss.moneySaved}
        />
      </section>
    </article>
  );
};

export default GlossIdAnalysis;
