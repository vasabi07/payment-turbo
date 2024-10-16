/*
  Warnings:

  - The primary key for the `Balance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Balance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PeerTransfer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PeerTransfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `Balance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `senderId` on the `PeerTransfer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `receiverId` on the `PeerTransfer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_userId_fkey";

-- DropForeignKey
ALTER TABLE "PeerTransfer" DROP CONSTRAINT "PeerTransfer_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "PeerTransfer" DROP CONSTRAINT "PeerTransfer_senderId_fkey";

-- AlterTable
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Balance_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PeerTransfer" DROP CONSTRAINT "PeerTransfer_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "senderId",
ADD COLUMN     "senderId" INTEGER NOT NULL,
DROP COLUMN "receiverId",
ADD COLUMN     "receiverId" INTEGER NOT NULL,
ADD CONSTRAINT "PeerTransfer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_userId_key" ON "Balance"("userId");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerTransfer" ADD CONSTRAINT "PeerTransfer_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerTransfer" ADD CONSTRAINT "PeerTransfer_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
