/*
  Warnings:

  - The values [TARIFF,OTHER] on the enum `CustomGlossTaxType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customGlossNonTariffRestrictionNRegulationDetailId` on the `CustomGlossFile` table. All the data in the column will be lost.
  - The primary key for the `CustomGlossNonTariffRestrictionNRegulation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `law` on the `CustomGlossNonTariffRestrictionNRegulation` table. All the data in the column will be lost.
  - You are about to drop the column `lawDescription` on the `CustomGlossNonTariffRestrictionNRegulation` table. All the data in the column will be lost.
  - The primary key for the `CustomGlossTax` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `CustomGlossNonTariffRestrictionNRegulationDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomGlossReport` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `summary` to the `CustomGloss` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actionsToTake` to the `CustomGlossNonTariffRestrictionNRegulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comparisons` to the `CustomGlossNonTariffRestrictionNRegulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `CustomGlossNonTariffRestrictionNRegulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `CustomGlossNonTariffRestrictionNRegulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `CustomGlossNonTariffRestrictionNRegulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `CustomGlossNonTariffRestrictionNRegulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `CustomGlossNonTariffRestrictionNRegulation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `CustomGlossNonTariffRestrictionNRegulation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `CustomGlossNonTariffRestrictionNRegulation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `CustomGlossTax` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CustomGlossNonTariffRestrictionNRegulationAbbreviationType" AS ENUM ('SC', 'SE', 'SRE', 'SCT', 'SSA', 'SHCP', 'SEGOB', 'SEMAR', 'SENER', 'SADER', 'SEDENA', 'SEMARNAT');

-- CreateEnum
CREATE TYPE "CustomGlossNonTariffRestrictionNRegulationStatusType" AS ENUM ('ERROR', 'WARNING', 'CHECKED');

-- AlterEnum
BEGIN;
CREATE TYPE "CustomGlossTaxType_new" AS ENUM ('IVA', 'IGI', 'IEPS', 'ISAN', 'TIGIE', 'PROSEC');
ALTER TABLE "CustomGlossTax" ALTER COLUMN "type" TYPE "CustomGlossTaxType_new" USING ("type"::text::"CustomGlossTaxType_new");
ALTER TYPE "CustomGlossTaxType" RENAME TO "CustomGlossTaxType_old";
ALTER TYPE "CustomGlossTaxType_new" RENAME TO "CustomGlossTaxType";
DROP TYPE "CustomGlossTaxType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CustomGlossFile" DROP CONSTRAINT "CustomGlossFile_customGlossNonTariffRestrictionNRegulation_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossNonTariffRestrictionNRegulationDetail" DROP CONSTRAINT "CustomGlossNonTariffRestrictionNRegulationDetail_customGlo_fkey";

-- DropForeignKey
ALTER TABLE "CustomGlossReport" DROP CONSTRAINT "CustomGlossReport_customGlossId_fkey";

-- DropIndex
DROP INDEX "CustomGlossFile_customGlossNonTariffRestrictionNRegulationD_key";

-- AlterTable
ALTER TABLE "CustomGloss" ADD COLUMN     "summary" TEXT NOT NULL,
ALTER COLUMN "analysisType" SET DEFAULT 'REGULATION';

-- AlterTable
ALTER TABLE "CustomGlossFile" DROP COLUMN "customGlossNonTariffRestrictionNRegulationDetailId";

-- AlterTable
ALTER TABLE "CustomGlossNonTariffRestrictionNRegulation" DROP CONSTRAINT "CustomGlossNonTariffRestrictionNRegulation_pkey",
DROP COLUMN "law",
DROP COLUMN "lawDescription",
ADD COLUMN     "actionsToTake" TEXT NOT NULL,
ADD COLUMN     "comparisons" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "result" TEXT NOT NULL,
ADD COLUMN     "status" "CustomGlossNonTariffRestrictionNRegulationStatusType" NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "CustomGlossNonTariffRestrictionNRegulationAbbreviationType" NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "CustomGlossNonTariffRestrictionNRegulation_pkey" PRIMARY KEY ("id", "customGlossId");

-- AlterTable
ALTER TABLE "CustomGlossTax" DROP CONSTRAINT "CustomGlossTax_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "CustomGlossTax_pkey" PRIMARY KEY ("id", "customGlossId");

-- DropTable
DROP TABLE "CustomGlossNonTariffRestrictionNRegulationDetail";

-- DropTable
DROP TABLE "CustomGlossReport";
