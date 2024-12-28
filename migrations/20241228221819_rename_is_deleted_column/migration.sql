/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `depots` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `hosts` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `shelves` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `categories` DROP COLUMN `isDeleted`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `depots` DROP COLUMN `isDeleted`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `hosts` DROP COLUMN `isDeleted`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `items` DROP COLUMN `isDeleted`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `isDeleted`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `isDeleted`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `shelves` DROP COLUMN `isDeleted`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `isDeleted`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;
