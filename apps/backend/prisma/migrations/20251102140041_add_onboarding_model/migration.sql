-- CreateTable
CREATE TABLE `onboarding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `activityLevel` VARCHAR(191) NOT NULL,
    `fitnessLevel` VARCHAR(191) NOT NULL,
    `focusArea` JSON NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `days` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `workoutGoal` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `onboarding_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `onboarding` ADD CONSTRAINT `onboarding_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
