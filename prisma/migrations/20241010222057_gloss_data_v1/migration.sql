/*
  Warnings:

  - You are about to drop the column `position` on the `User` table. All the data in the column will be lost.
  - Added the required column `patentNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OperationStatus" AS ENUM ('IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "AnalysisType" AS ENUM ('REGULATION');

-- CreateEnum
CREATE TYPE "CustomGlossType" AS ENUM ('LOW', 'HIGH');

-- CreateEnum
CREATE TYPE "CustomGlossTaxType" AS ENUM ('TARIFF', 'IVA', 'IEPS', 'OTHER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "position",
ADD COLUMN     "patentNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserOnCustom" (
    "userId" TEXT NOT NULL,
    "customId" TEXT NOT NULL,

    CONSTRAINT "UserOnCustom_pkey" PRIMARY KEY ("userId","customId")
);

-- CreateTable
CREATE TABLE "Custom" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "xCoordinate" DOUBLE PRECISION NOT NULL,
    "yCoordinate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Custom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGloss" (
    "id" TEXT NOT NULL,
    "timeSaved" DOUBLE PRECISION NOT NULL,
    "moneySaved" DOUBLE PRECISION NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "importerName" TEXT NOT NULL,
    "analysisType" "AnalysisType" NOT NULL,
    "operationStatus" "OperationStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGloss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossAlert" (
    "id" TEXT NOT NULL,
    "type" "CustomGlossType" NOT NULL,
    "description" TEXT NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossFile" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "customGlossNonTariffRestrictionNRegulationDetailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossTax" (
    "id" TEXT NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "type" "CustomGlossTaxType" NOT NULL,
    "isCheck" BOOLEAN NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossNonTariffRestrictionNRegulation" (
    "id" TEXT NOT NULL,
    "law" TEXT NOT NULL,
    "lawDescription" TEXT NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossNonTariffRestrictionNRegulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossNonTariffRestrictionNRegulationDetail" (
    "id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "isCheck" BOOLEAN NOT NULL,
    "operation" TEXT NOT NULL,
    "checkDescription" TEXT,
    "customGlossNonTariffRestrictionNRegulationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossNonTariffRestrictionNRegulationDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossReport" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossFile_customGlossNonTariffRestrictionNRegulationD_key" ON "CustomGlossFile"("customGlossNonTariffRestrictionNRegulationDetailId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossReport_customGlossId_key" ON "CustomGlossReport"("customGlossId");

-- AddForeignKey
ALTER TABLE "UserOnCustom" ADD CONSTRAINT "UserOnCustom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnCustom" ADD CONSTRAINT "UserOnCustom_customId_fkey" FOREIGN KEY ("customId") REFERENCES "Custom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGloss" ADD CONSTRAINT "CustomGloss_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossAlert" ADD CONSTRAINT "CustomGlossAlert_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossFile" ADD CONSTRAINT "CustomGlossFile_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossFile" ADD CONSTRAINT "CustomGlossFile_customGlossNonTariffRestrictionNRegulation_fkey" FOREIGN KEY ("customGlossNonTariffRestrictionNRegulationDetailId") REFERENCES "CustomGlossNonTariffRestrictionNRegulationDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossTax" ADD CONSTRAINT "CustomGlossTax_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossNonTariffRestrictionNRegulation" ADD CONSTRAINT "CustomGlossNonTariffRestrictionNRegulation_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossNonTariffRestrictionNRegulationDetail" ADD CONSTRAINT "CustomGlossNonTariffRestrictionNRegulationDetail_customGlo_fkey" FOREIGN KEY ("customGlossNonTariffRestrictionNRegulationId") REFERENCES "CustomGlossNonTariffRestrictionNRegulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossReport" ADD CONSTRAINT "CustomGlossReport_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;
