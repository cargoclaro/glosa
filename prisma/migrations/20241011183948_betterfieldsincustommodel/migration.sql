/*
  Warnings:

  - You are about to drop the column `xCoordinate` on the `Custom` table. All the data in the column will be lost.
  - You are about to drop the column `yCoordinate` on the `Custom` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Custom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Custom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Custom" DROP COLUMN "xCoordinate",
DROP COLUMN "yCoordinate",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
