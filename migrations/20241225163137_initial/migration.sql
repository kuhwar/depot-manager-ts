-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `depots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `display_name` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NOT NULL,
    `admin_path` VARCHAR(191) NOT NULL DEFAULT '/admin-dashboard',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hosts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `depot_id` INTEGER NOT NULL,

    UNIQUE INDEX `hosts_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `email` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `profile_photo` VARCHAR(191) NOT NULL,
    `depot_id` INTEGER NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shelves` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `depot_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `upc` VARCHAR(191) NOT NULL,
    `visuals` JSON NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `walmartId` VARCHAR(191) NULL,
    `categoryId` INTEGER NOT NULL,

    INDEX `products_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `sold_at` DATETIME(3) NULL,
    `product_id` INTEGER NOT NULL,
    `shelf_id` INTEGER NOT NULL,
    `depot_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `product_id` INTEGER NOT NULL,
    `depot_id` INTEGER NOT NULL,

    UNIQUE INDEX `posts_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hosts` ADD CONSTRAINT `hosts_depot_id_fkey` FOREIGN KEY (`depot_id`) REFERENCES `depots`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_depot_id_fkey` FOREIGN KEY (`depot_id`) REFERENCES `depots`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shelves` ADD CONSTRAINT `shelves_depot_id_fkey` FOREIGN KEY (`depot_id`) REFERENCES `depots`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_shelf_id_fkey` FOREIGN KEY (`shelf_id`) REFERENCES `shelves`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_depot_id_fkey` FOREIGN KEY (`depot_id`) REFERENCES `depots`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_depot_id_fkey` FOREIGN KEY (`depot_id`) REFERENCES `depots`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
