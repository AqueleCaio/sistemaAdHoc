/*
  Warnings:

  - The values [SAUDE,ECONOMIA,AMBIENTE,TECNOLOGIA,DEMOGRAFIA] on the enum `categoria` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "categoria_new" AS ENUM ('Saude', 'Economia', 'Ambiente', 'Tecnologia', 'Demografia');
ALTER TABLE "indicador" ALTER COLUMN "categoria" TYPE "categoria_new" USING ("categoria"::text::"categoria_new");
ALTER TYPE "categoria" RENAME TO "categoria_old";
ALTER TYPE "categoria_new" RENAME TO "categoria";
DROP TYPE "categoria_old";
COMMIT;
