/*
  Warnings:

  - A unique constraint covering the columns `[patentNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_patentNumber_key" ON "User"("patentNumber");
