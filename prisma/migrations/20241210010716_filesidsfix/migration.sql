/*
  Warnings:

  - The primary key for the `CustomGlossAlert` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CustomGlossFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `CustomGlossAlert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `CustomGlossFile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CustomGlossAlert" DROP CONSTRAINT "CustomGlossAlert_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "CustomGlossAlert_pkey" PRIMARY KEY ("id", "customGlossId");

-- AlterTable
ALTER TABLE "CustomGlossFile" DROP CONSTRAINT "CustomGlossFile_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "CustomGlossFile_pkey" PRIMARY KEY ("id", "customGlossId");
