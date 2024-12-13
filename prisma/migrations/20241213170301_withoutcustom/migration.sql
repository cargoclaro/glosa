/*
  Warnings:

  - You are about to drop the column `customId` on the `CustomGloss` table. All the data in the column will be lost.
  - You are about to drop the `Custom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOnCustom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomGloss" DROP CONSTRAINT "CustomGloss_customId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnCustom" DROP CONSTRAINT "UserOnCustom_customId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnCustom" DROP CONSTRAINT "UserOnCustom_userId_fkey";

-- AlterTable
ALTER TABLE "CustomGloss" DROP COLUMN "customId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" SET DEFAULT '/assets/images/profilepic.webp';

-- DropTable
DROP TABLE "Custom";

-- DropTable
DROP TABLE "UserOnCustom";
