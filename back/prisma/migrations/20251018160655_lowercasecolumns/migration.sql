/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ambiente` table. All the data in the column will be lost.
  - You are about to drop the column `indicadorId` on the `ambiente` table. All the data in the column will be lost.
  - You are about to drop the column `paisId` on the `ambiente` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `demografia` table. All the data in the column will be lost.
  - You are about to drop the column `indicadorId` on the `demografia` table. All the data in the column will be lost.
  - You are about to drop the column `paisId` on the `demografia` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `economia` table. All the data in the column will be lost.
  - You are about to drop the column `indicadorId` on the `economia` table. All the data in the column will be lost.
  - You are about to drop the column `paisId` on the `economia` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `pais` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `pais` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `saude` table. All the data in the column will be lost.
  - You are about to drop the column `indicadorId` on the `saude` table. All the data in the column will be lost.
  - You are about to drop the column `paisId` on the `saude` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `tecnologia` table. All the data in the column will be lost.
  - You are about to drop the column `indicadorId` on the `tecnologia` table. All the data in the column will be lost.
  - You are about to drop the column `paisId` on the `tecnologia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pais_id,indicador_id,ano]` on the table `ambiente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pais_id,indicador_id,ano]` on the table `demografia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pais_id,indicador_id,ano]` on the table `economia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pais_id,indicador_id,ano]` on the table `saude` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pais_id,indicador_id,ano]` on the table `tecnologia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `indicador_id` to the `ambiente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais_id` to the `ambiente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indicador_id` to the `demografia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais_id` to the `demografia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indicador_id` to the `economia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais_id` to the `economia` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `categoria` on the `indicador` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `indicador_id` to the `saude` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais_id` to the `saude` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indicador_id` to the `tecnologia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais_id` to the `tecnologia` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "categoria" AS ENUM ('SAUDE', 'ECONOMIA', 'AMBIENTE', 'TECNOLOGIA', 'DEMOGRAFIA');

-- DropForeignKey
ALTER TABLE "ambiente" DROP CONSTRAINT "ambiente_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "ambiente" DROP CONSTRAINT "ambiente_paisId_fkey";

-- DropForeignKey
ALTER TABLE "demografia" DROP CONSTRAINT "demografia_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "demografia" DROP CONSTRAINT "demografia_paisId_fkey";

-- DropForeignKey
ALTER TABLE "economia" DROP CONSTRAINT "economia_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "economia" DROP CONSTRAINT "economia_paisId_fkey";

-- DropForeignKey
ALTER TABLE "saude" DROP CONSTRAINT "saude_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "saude" DROP CONSTRAINT "saude_paisId_fkey";

-- DropForeignKey
ALTER TABLE "tecnologia" DROP CONSTRAINT "tecnologia_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "tecnologia" DROP CONSTRAINT "tecnologia_paisId_fkey";

-- DropIndex
DROP INDEX "ambiente_indicadorId_idx";

-- DropIndex
DROP INDEX "ambiente_paisId_idx";

-- DropIndex
DROP INDEX "ambiente_paisId_indicadorId_ano_key";

-- DropIndex
DROP INDEX "demografia_indicadorId_idx";

-- DropIndex
DROP INDEX "demografia_paisId_idx";

-- DropIndex
DROP INDEX "demografia_paisId_indicadorId_ano_key";

-- DropIndex
DROP INDEX "economia_indicadorId_idx";

-- DropIndex
DROP INDEX "economia_paisId_idx";

-- DropIndex
DROP INDEX "economia_paisId_indicadorId_ano_key";

-- DropIndex
DROP INDEX "saude_indicadorId_idx";

-- DropIndex
DROP INDEX "saude_paisId_idx";

-- DropIndex
DROP INDEX "saude_paisId_indicadorId_ano_key";

-- DropIndex
DROP INDEX "tecnologia_indicadorId_idx";

-- DropIndex
DROP INDEX "tecnologia_paisId_idx";

-- DropIndex
DROP INDEX "tecnologia_paisId_indicadorId_ano_key";

-- AlterTable
ALTER TABLE "ambiente" DROP COLUMN "createdAt",
DROP COLUMN "indicadorId",
DROP COLUMN "paisId",
ADD COLUMN     "indicador_id" TEXT NOT NULL,
ADD COLUMN     "pais_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "demografia" DROP COLUMN "createdAt",
DROP COLUMN "indicadorId",
DROP COLUMN "paisId",
ADD COLUMN     "indicador_id" TEXT NOT NULL,
ADD COLUMN     "pais_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "economia" DROP COLUMN "createdAt",
DROP COLUMN "indicadorId",
DROP COLUMN "paisId",
ADD COLUMN     "indicador_id" TEXT NOT NULL,
ADD COLUMN     "pais_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "indicador" DROP COLUMN "categoria",
ADD COLUMN     "categoria" "categoria" NOT NULL;

-- AlterTable
ALTER TABLE "pais" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "saude" DROP COLUMN "createdAt",
DROP COLUMN "indicadorId",
DROP COLUMN "paisId",
ADD COLUMN     "indicador_id" TEXT NOT NULL,
ADD COLUMN     "pais_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tecnologia" DROP COLUMN "createdAt",
DROP COLUMN "indicadorId",
DROP COLUMN "paisId",
ADD COLUMN     "indicador_id" TEXT NOT NULL,
ADD COLUMN     "pais_id" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Categoria";

-- CreateIndex
CREATE INDEX "ambiente_pais_id_idx" ON "ambiente"("pais_id");

-- CreateIndex
CREATE INDEX "ambiente_indicador_id_idx" ON "ambiente"("indicador_id");

-- CreateIndex
CREATE UNIQUE INDEX "ambiente_pais_id_indicador_id_ano_key" ON "ambiente"("pais_id", "indicador_id", "ano");

-- CreateIndex
CREATE INDEX "demografia_pais_id_idx" ON "demografia"("pais_id");

-- CreateIndex
CREATE INDEX "demografia_indicador_id_idx" ON "demografia"("indicador_id");

-- CreateIndex
CREATE UNIQUE INDEX "demografia_pais_id_indicador_id_ano_key" ON "demografia"("pais_id", "indicador_id", "ano");

-- CreateIndex
CREATE INDEX "economia_pais_id_idx" ON "economia"("pais_id");

-- CreateIndex
CREATE INDEX "economia_indicador_id_idx" ON "economia"("indicador_id");

-- CreateIndex
CREATE UNIQUE INDEX "economia_pais_id_indicador_id_ano_key" ON "economia"("pais_id", "indicador_id", "ano");

-- CreateIndex
CREATE INDEX "saude_pais_id_idx" ON "saude"("pais_id");

-- CreateIndex
CREATE INDEX "saude_indicador_id_idx" ON "saude"("indicador_id");

-- CreateIndex
CREATE UNIQUE INDEX "saude_pais_id_indicador_id_ano_key" ON "saude"("pais_id", "indicador_id", "ano");

-- CreateIndex
CREATE INDEX "tecnologia_pais_id_idx" ON "tecnologia"("pais_id");

-- CreateIndex
CREATE INDEX "tecnologia_indicador_id_idx" ON "tecnologia"("indicador_id");

-- CreateIndex
CREATE UNIQUE INDEX "tecnologia_pais_id_indicador_id_ano_key" ON "tecnologia"("pais_id", "indicador_id", "ano");

-- AddForeignKey
ALTER TABLE "saude" ADD CONSTRAINT "saude_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saude" ADD CONSTRAINT "saude_indicador_id_fkey" FOREIGN KEY ("indicador_id") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "economia" ADD CONSTRAINT "economia_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "economia" ADD CONSTRAINT "economia_indicador_id_fkey" FOREIGN KEY ("indicador_id") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambiente" ADD CONSTRAINT "ambiente_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambiente" ADD CONSTRAINT "ambiente_indicador_id_fkey" FOREIGN KEY ("indicador_id") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tecnologia" ADD CONSTRAINT "tecnologia_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tecnologia" ADD CONSTRAINT "tecnologia_indicador_id_fkey" FOREIGN KEY ("indicador_id") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demografia" ADD CONSTRAINT "demografia_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demografia" ADD CONSTRAINT "demografia_indicador_id_fkey" FOREIGN KEY ("indicador_id") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
