/*
  Warnings:

  - Added the required column `name` to the `CustomGlossFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomGlossFile" ADD COLUMN     "name" TEXT NOT NULL;
