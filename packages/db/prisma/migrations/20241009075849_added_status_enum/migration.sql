/*
  Warnings:

  - Added the required column `status` to the `PeerTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Processing', 'failure', 'Success');

-- AlterTable
ALTER TABLE "PeerTransfer" ADD COLUMN     "status" "Status" NOT NULL;
