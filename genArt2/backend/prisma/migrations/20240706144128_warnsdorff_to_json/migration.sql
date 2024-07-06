/*
  Warnings:

  - Changed the type of `path` on the `Warnsdorff` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Warnsdorff" DROP COLUMN "path",
ADD COLUMN     "path" JSONB NOT NULL;
