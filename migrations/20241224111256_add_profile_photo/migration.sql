/*
  Warnings:

  - Added the required column `profile_photo` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `profile_photo` VARCHAR(191) NOT NULL;
