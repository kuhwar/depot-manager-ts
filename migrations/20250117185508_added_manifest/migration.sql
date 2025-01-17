-- CreateTable
CREATE TABLE `manifests` (
    `id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `cost` DOUBLE NOT NULL DEFAULT 0,
    `totalValue` DOUBLE NOT NULL DEFAULT 0,
    `originalFile` LONGTEXT NOT NULL,

    UNIQUE INDEX `manifests_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manifest_items` (
    `id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `upc` VARCHAR(191) NOT NULL,
    `pallet_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `visual` VARCHAR(191) NOT NULL DEFAULT '/default-product.png',
    `walmart_id` VARCHAR(191) NOT NULL,
    `item_id` INTEGER NULL,
    `manifest_id` INTEGER NOT NULL,

    UNIQUE INDEX `manifest_items_id_key`(`id`),
    UNIQUE INDEX `manifest_items_item_id_key`(`item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `manifest_items` ADD CONSTRAINT `manifest_items_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manifest_items` ADD CONSTRAINT `manifest_items_manifest_id_fkey` FOREIGN KEY (`manifest_id`) REFERENCES `manifests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
