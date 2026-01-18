/*
  Warnings:

  - You are about to drop the column `exerciseApiId` on the `workoutPlanExercises` table. All the data in the column will be lost.
  - Added the required column `exerciseApiCode` to the `workoutPlanExercises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `workoutPlanExercises` DROP COLUMN `exerciseApiId`,
    ADD COLUMN `exerciseApiCode` VARCHAR(191) NOT NULL;
