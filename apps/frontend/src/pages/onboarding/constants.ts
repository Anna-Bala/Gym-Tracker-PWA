import FlexedBiceps from "@icons/flexed-biceps.svg?react";
import HandFist from "@icons/hand-fist.svg?react";
import HandOne from "@icons/hand-one.svg?react";
import HandThumbsUp from "@icons/hand-thumbsup.svg?react";
import HandTwo from "@icons/hand-two.svg?react";
import Leg from "@icons/leg.svg?react";
import PersonComputer from "@icons/person-computer.svg?react";
import PersonLifting from "@icons/person-lifting.svg?react";
import PersonPortrait from "@icons/person-portrait.svg?react";
import PersonRunning from "@icons/person-running.svg?react";
import PersonSitting from "@icons/person-sitting.svg?react";
import PersonStanding from "@icons/person-standing.svg?react";
import PersonWalking from "@icons/person-walking.svg?react";
import Scale from "@icons/scale.svg?react";
import Trophy from "@icons/trophy.svg?react";

export const daysOptions = Array.from({ length: 7 - 1 + 1 }, (_, i) => (i + 1).toString()).map((day) => ({ label: day, value: day }));


export const activityLevelOptions = [
  {
    label: "Sedentary",
    description: "Little to no exercise",
    value: "sedentary",
    Icon: PersonComputer,
  },
  {
    label: "Lightly Active",
    description: "Exercise or sports 1-3 days a week",
    value: "light",
    Icon: PersonWalking,
  },
  {
    label: "Moderately Active",
    description: "Exercise or sports 3-5 days a week",
    value: "moderate",
    Icon: PersonRunning,
  },
  {
    label: "Very Active",
    description: "Exercise or sports 6-7 days a week",
    value: "highly",
    Icon: PersonLifting,
  },
  {
    label: "Athlete",
    description: "Physical job or training twice a day",
    value: "athlete",
    Icon: Trophy,
  },
];

export const fitnessLevelOptions = [
  {
    label: "Beginner",
    description: "1-10 push-ups",
    value: "beginner",
    Icon: HandOne,
  },
  {
    label: "Intermediate",
    description: "11-20 push-ups",
    value: "intermediate",
    Icon: HandTwo,
  },
  {
    label: "Advanced",
    description: "20-40 push-ups",
    value: "advanced",
    Icon: HandThumbsUp,
  },
  {
    label: "Athlete",
    description: "40+ push-ups",
    value: "athlete",
    Icon: HandFist,
  },
];

export const focusAreaOptions = [
  {
    label: "Full Body",
    value: "fullBody",
    Icon: PersonStanding,
  },
  {
    label: "Shoulders",
    value: "shoulders",
    Icon: PersonLifting,
  },
  {
    label: "Chest",
    value: "chest",
    Icon: PersonPortrait,
  },
  {
    label: "Arms",
    value: "arms",
    Icon: FlexedBiceps,
  },
  {
    label: "Back",
    value: "back",
    Icon: PersonWalking,
  },
  {
    label: "Stomach",
    value: "stomach",
    Icon: PersonSitting,
  },
  {
    label: "Legs",
    value: "legs",
    Icon: Leg,
  },
];

export const workoutGoalOptions = [
  {
    label: "Lose Weight",
    value: "loseWeight",
    Icon: Scale,
  },
  {
    label: "Build Muscle",
    value: "buildMuscle",
    Icon: FlexedBiceps,
  },
  {
    label: "Stay Fit",
    value: "stayFit",
    Icon: PersonSitting,
  },
];
