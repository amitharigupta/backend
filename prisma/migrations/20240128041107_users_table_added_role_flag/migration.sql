/*
  Warnings:

  - The `gender` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "gender",
ADD COLUMN     "gender" BOOLEAN NOT NULL DEFAULT true;
