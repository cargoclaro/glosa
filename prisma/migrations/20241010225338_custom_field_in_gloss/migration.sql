/*
  Warnings:

  - Added the required column `customId` to the `CustomGloss` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomGloss" ADD COLUMN     "customId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomGloss" ADD CONSTRAINT "CustomGloss_customId_fkey" FOREIGN KEY ("customId") REFERENCES "Custom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
