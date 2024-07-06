/*
  Warnings:

  - Added the required column `currentStep` to the `Warnsdorff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Warnsdorff" ADD COLUMN     "currentStep" INTEGER NOT NULL;
