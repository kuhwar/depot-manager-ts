/*
  Warnings:

  - You are about to drop the column `originalFile` on the `manifests` table. All the data in the column will be lost.
  - You are about to drop the column `totalValue` on the `manifests` table. All the data in the column will be lost.
  - Added the required column `original_file` to the `manifests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `manifests` DROP COLUMN `originalFile`,
    DROP COLUMN `totalValue`,
    ADD COLUMN `original_file` LONGTEXT NOT NULL,
    ADD COLUMN `total_value` DOUBLE NOT NULL DEFAULT 0;
