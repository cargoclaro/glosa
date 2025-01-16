/*
  Warnings:

  - Changed the type of `fullContext` on the `CustomGlossTab` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CustomGlossTab" DROP COLUMN "fullContext",
ADD COLUMN     "fullContext" BOOLEAN NOT NULL;
