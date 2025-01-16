/*
  Warnings:

  - You are about to drop the column `analysisType` on the `CustomGloss` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `CustomGloss` table. All the data in the column will be lost.
  - You are about to drop the `CustomGlossNonTariffRestrictionNRegulation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomGlossTax` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CustomGlossTransportType" AS ENUM ('AIR', 'SEA', 'LAND');

-- DropForeignKey
ALTER TABLE "CustomGlossNonTariffRestrictionNRegulation" DROP CONSTRAINT "CustomGlossNonTariffRestrictionNRegulation_customGlossId_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossTax" DROP CONSTRAINT "CustomGlossTax_customGlossId_fkey";

-- AlterTable
ALTER TABLE "CustomGloss" DROP COLUMN "analysisType",
DROP COLUMN "isVerified";

-- DropTable
DROP TABLE "CustomGlossNonTariffRestrictionNRegulation";

-- DropTable
DROP TABLE "CustomGlossTax";

-- DropEnum
DROP TYPE "AnalysisType";

-- DropEnum
DROP TYPE "CustomGlossNonTariffRestrictionNRegulationAbbreviationType";

-- DropEnum
DROP TYPE "CustomGlossNonTariffRestrictionNRegulationStatusType";

-- DropEnum
DROP TYPE "CustomGlossTaxType";

-- CreateTable
CREATE TABLE "CustomGlossPedimentNum" (
    "id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossPedimentNum_pkey" PRIMARY KEY ("id","customGlossId")
);

-- CreateTable
CREATE TABLE "CustomGlossOperationType" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "appendices" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossOperationType_pkey" PRIMARY KEY ("id","customGlossId")
);

-- CreateTable
CREATE TABLE "CustomGlossDestinationOrigin" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "destinationOriginKey" TEXT NOT NULL,
    "appendixValidator" TEXT NOT NULL,
    "appendices" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossDestinationOrigin_pkey" PRIMARY KEY ("id","customGlossId")
);

-- CreateTable
CREATE TABLE "CustomGlossOperation" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "calculations" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossOperation_pkey" PRIMARY KEY ("id","customGlossId")
);

-- CreateTable
CREATE TABLE "CustomGlossGrossWeight" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "calculations" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossGrossWeight_pkey" PRIMARY KEY ("id","customGlossId")
);

-- CreateTable
CREATE TABLE "CustomGlossInvoiceData" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "importerExporter" TEXT NOT NULL,
    "supplierBuyer" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossInvoiceData_pkey" PRIMARY KEY ("id","customGlossId")
);

-- CreateTable
CREATE TABLE "CustomGlossTransportData" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "type" "CustomGlossTransportType" NOT NULL,
    "data" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossTransportData_pkey" PRIMARY KEY ("id","customGlossId")
);

-- CreateTable
CREATE TABLE "CustomGlossCertification" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "taxes" TEXT NOT NULL,
    "restrictionsRegulations" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossCertification_pkey" PRIMARY KEY ("id","customGlossId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossPedimentNum_customGlossId_key" ON "CustomGlossPedimentNum"("customGlossId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossOperationType_customGlossId_key" ON "CustomGlossOperationType"("customGlossId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossDestinationOrigin_customGlossId_key" ON "CustomGlossDestinationOrigin"("customGlossId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossOperation_customGlossId_key" ON "CustomGlossOperation"("customGlossId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossGrossWeight_customGlossId_key" ON "CustomGlossGrossWeight"("customGlossId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossInvoiceData_customGlossId_key" ON "CustomGlossInvoiceData"("customGlossId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossTransportData_customGlossId_key" ON "CustomGlossTransportData"("customGlossId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossCertification_customGlossId_key" ON "CustomGlossCertification"("customGlossId");

-- AddForeignKey
ALTER TABLE "CustomGlossPedimentNum" ADD CONSTRAINT "CustomGlossPedimentNum_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossOperationType" ADD CONSTRAINT "CustomGlossOperationType_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossDestinationOrigin" ADD CONSTRAINT "CustomGlossDestinationOrigin_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossOperation" ADD CONSTRAINT "CustomGlossOperation_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossGrossWeight" ADD CONSTRAINT "CustomGlossGrossWeight_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossInvoiceData" ADD CONSTRAINT "CustomGlossInvoiceData_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossTransportData" ADD CONSTRAINT "CustomGlossTransportData_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossCertification" ADD CONSTRAINT "CustomGlossCertification_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;
