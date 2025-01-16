/*
  Warnings:

  - You are about to drop the `CustomGlossCertification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomGlossDestinationOrigin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomGlossGrossWeight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomGlossInvoiceData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomGlossOperation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomGlossOperationType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomGlossPedimentNum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomGlossTransportData` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CustomGlossTabContextType" AS ENUM ('PROVIDED', 'EXTERNAL');

-- DropForeignKey
ALTER TABLE "CustomGlossCertification" DROP CONSTRAINT "CustomGlossCertification_customGlossId_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossDestinationOrigin" DROP CONSTRAINT "CustomGlossDestinationOrigin_customGlossId_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossGrossWeight" DROP CONSTRAINT "CustomGlossGrossWeight_customGlossId_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossInvoiceData" DROP CONSTRAINT "CustomGlossInvoiceData_customGlossId_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossOperation" DROP CONSTRAINT "CustomGlossOperation_customGlossId_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossOperationType" DROP CONSTRAINT "CustomGlossOperationType_customGlossId_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossPedimentNum" DROP CONSTRAINT "CustomGlossPedimentNum_customGlossId_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossTransportData" DROP CONSTRAINT "CustomGlossTransportData_customGlossId_fkey";

-- DropTable
DROP TABLE "CustomGlossCertification";

-- DropTable
DROP TABLE "CustomGlossDestinationOrigin";

-- DropTable
DROP TABLE "CustomGlossGrossWeight";

-- DropTable
DROP TABLE "CustomGlossInvoiceData";

-- DropTable
DROP TABLE "CustomGlossOperation";

-- DropTable
DROP TABLE "CustomGlossOperationType";

-- DropTable
DROP TABLE "CustomGlossPedimentNum";

-- DropTable
DROP TABLE "CustomGlossTransportData";

-- DropEnum
DROP TYPE "CustomGlossTransportType";

-- CreateTable
CREATE TABLE "CustomGlossTab" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "fullContext" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "customGlossId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossTabContext" (
    "id" SERIAL NOT NULL,
    "type" "CustomGlossTabContextType" NOT NULL,
    "origin" TEXT NOT NULL,
    "customGlossTabId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossTabContext_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossTabContextData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "customGlossTabContextId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossTabContextData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossTabValidationStep" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "llmAnalysis" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "summary" TEXT NOT NULL,
    "customGlossTabId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossTabValidationStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossTabValidationStepActionToTake" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "customGlossTabValidationStepId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossTabValidationStepActionToTake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomGlossTabValidationStepResources" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "customGlossTabValidationStepId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomGlossTabValidationStepResources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomGlossTab_name_customGlossId_key" ON "CustomGlossTab"("name", "customGlossId");

-- AddForeignKey
ALTER TABLE "CustomGlossTab" ADD CONSTRAINT "CustomGlossTab_customGlossId_fkey" FOREIGN KEY ("customGlossId") REFERENCES "CustomGloss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossTabContext" ADD CONSTRAINT "CustomGlossTabContext_customGlossTabId_fkey" FOREIGN KEY ("customGlossTabId") REFERENCES "CustomGlossTab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossTabContextData" ADD CONSTRAINT "CustomGlossTabContextData_customGlossTabContextId_fkey" FOREIGN KEY ("customGlossTabContextId") REFERENCES "CustomGlossTabContext"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossTabValidationStep" ADD CONSTRAINT "CustomGlossTabValidationStep_customGlossTabId_fkey" FOREIGN KEY ("customGlossTabId") REFERENCES "CustomGlossTab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossTabValidationStepActionToTake" ADD CONSTRAINT "CustomGlossTabValidationStepActionToTake_customGlossTabVal_fkey" FOREIGN KEY ("customGlossTabValidationStepId") REFERENCES "CustomGlossTabValidationStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomGlossTabValidationStepResources" ADD CONSTRAINT "CustomGlossTabValidationStepResources_customGlossTabValida_fkey" FOREIGN KEY ("customGlossTabValidationStepId") REFERENCES "CustomGlossTabValidationStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
