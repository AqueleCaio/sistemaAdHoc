/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('SAUDE', 'ECONOMIA', 'AMBIENTE', 'TECNOLOGIA', 'DEMOGRAFIA');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Pais" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "iso3" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,

    CONSTRAINT "Indicador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saude" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Saude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Economia" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Economia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ambiente" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ambiente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tecnologia" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tecnologia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demografia" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Demografia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pais_iso3_key" ON "Pais"("iso3");

-- CreateIndex
CREATE INDEX "Saude_paisId_idx" ON "Saude"("paisId");

-- CreateIndex
CREATE INDEX "Saude_indicadorId_idx" ON "Saude"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "Saude_paisId_indicadorId_ano_key" ON "Saude"("paisId", "indicadorId", "ano");

-- CreateIndex
CREATE INDEX "Economia_paisId_idx" ON "Economia"("paisId");

-- CreateIndex
CREATE INDEX "Economia_indicadorId_idx" ON "Economia"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "Economia_paisId_indicadorId_ano_key" ON "Economia"("paisId", "indicadorId", "ano");

-- CreateIndex
CREATE INDEX "Ambiente_paisId_idx" ON "Ambiente"("paisId");

-- CreateIndex
CREATE INDEX "Ambiente_indicadorId_idx" ON "Ambiente"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "Ambiente_paisId_indicadorId_ano_key" ON "Ambiente"("paisId", "indicadorId", "ano");

-- CreateIndex
CREATE INDEX "Tecnologia_paisId_idx" ON "Tecnologia"("paisId");

-- CreateIndex
CREATE INDEX "Tecnologia_indicadorId_idx" ON "Tecnologia"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "Tecnologia_paisId_indicadorId_ano_key" ON "Tecnologia"("paisId", "indicadorId", "ano");

-- CreateIndex
CREATE INDEX "Demografia_paisId_idx" ON "Demografia"("paisId");

-- CreateIndex
CREATE INDEX "Demografia_indicadorId_idx" ON "Demografia"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "Demografia_paisId_indicadorId_ano_key" ON "Demografia"("paisId", "indicadorId", "ano");

-- AddForeignKey
ALTER TABLE "Saude" ADD CONSTRAINT "Saude_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saude" ADD CONSTRAINT "Saude_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Economia" ADD CONSTRAINT "Economia_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Economia" ADD CONSTRAINT "Economia_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ambiente" ADD CONSTRAINT "Ambiente_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ambiente" ADD CONSTRAINT "Ambiente_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tecnologia" ADD CONSTRAINT "Tecnologia_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tecnologia" ADD CONSTRAINT "Tecnologia_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demografia" ADD CONSTRAINT "Demografia_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demografia" ADD CONSTRAINT "Demografia_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "Indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
