/*
  Warnings:

  - You are about to drop the column `specialtyRu` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `specialtyUz` on the `doctors` table. All the data in the column will be lost.
  - Added the required column `specialtyId` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "specialtyRu",
DROP COLUMN "specialtyUz",
ADD COLUMN     "specialtyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "nameUz" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
