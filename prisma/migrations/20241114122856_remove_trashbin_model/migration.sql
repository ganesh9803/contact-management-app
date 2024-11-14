/*
  Warnings:

  - You are about to drop the `trash_bin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "trash_bin" DROP CONSTRAINT "trash_bin_userId_fkey";

-- DropTable
DROP TABLE "trash_bin";
