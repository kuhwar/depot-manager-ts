/*
  Warnings:

  - You are about to drop the column `walmartId` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `walmartId`,
    ADD COLUMN `variation_label` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `walmart_id` VARCHAR(191) NULL;
