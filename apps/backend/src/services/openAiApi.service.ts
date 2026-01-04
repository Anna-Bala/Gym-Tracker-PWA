import OpenAI from "openai";
import { AIWorkoutPlan, FullOnboarding } from "@gym-tracker-pwa/schemas";

import { ErrorCode } from "../exceptions";
import { InternalException } from "../exceptions/internal-exception";
import { OPENAI_API_KEY } from "../secrets";
import exerciseApiService from "../services/exerciseApi.service";

const openAIClient = new OpenAI({ apiKey: OPENAI_API_KEY });

export class OpenAIApiService {
  async createWorkoutPlan(userOnboardingInfo: Partial<FullOnboarding>): Promise<AIWorkoutPlan | null> {
    let allExercises = [];

    try {
      const exerciseApiResponse = await exerciseApiService.getAllExercises(true);
      allExercises = exerciseApiResponse;
    } catch (error) {
      throw new InternalException("Something went wrong while fetching exercises", error, ErrorCode.INTERNAL_EXCEPTION);
    }

    const requestJsonSchemaTool = {
      type: "function",
      name: "create_workout_plan",
      description: "Generate a structured workout plan",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Keep it short, maximum 6 words, skip special characters like: -, (, )",
          },
          description: { type: "string", description: "Try to fit it in maximum 3 sentences." },
          days: {
            type: "array",
            description:
              "Enums represent days of the week, 1 is Monday and 7 is Sunday. When creating a workout plan, prioritize long-term sustainability. Unless the user specifically asks for a daily routine, provide a balanced split.",
            items: {
              type: "string",
              enum: ["1", "2", "3", "4", "5", "6", "7"],
            },
          },
          focusArea: {
            type: "array",
            items: {
              type: "string",
              enum: ["arms", "back", "chest", "fullBody", "legs", "shoulders", "stomach"],
            },
          },
          exercises: {
            type: "array",
            description: "Flat list of all exercises in the plan",
            items: {
              type: "object",
              properties: {
                exerciseApiId: {
                  description: "Use id strictly from exercises list, do not invent new ids.",
                  type: "string",
                },
                sets: {
                  type: "integer",
                },
                reps: {
                  type: "integer",
                },
              },
              additionalProperties: false,
              required: ["exerciseApiId", "sets", "reps"],
            },
          },
        },
        additionalProperties: false,
        required: ["name", "description", "days", "focusArea", "exercises"],
      },
      strict: true,
    } as const;

    const { activityLevel, age, days, fitnessLevel, focusArea, gender, height, weight, workoutGoal } = userOnboardingInfo;

    const response = await openAIClient.responses.create({
      model: "gpt-5-nano",
      input: [
        { role: "user", content: "Based on user data and preferences design a workout routine based strictly on the following exercises." },
        {
          role: "user",
          content: `${
            gender === "M" ? "Male" : "Female"
          }, age ${age} years old, height ${height}cm, weight ${weight}kg, workout goal - ${workoutGoal}, current activity level - ${activityLevel}, current fitness level - ${fitnessLevel}, wants to workout ${days} times a week, wants to focus on building those muscle groups - (${focusArea?.join(
            ", "
          )})`,
        },
        { role: "user", content: JSON.stringify({ exercises: allExercises }) },
      ],
      tools: [requestJsonSchemaTool],
    });

    if (response.output[1].type === "function_call") {
      const aiWorkoutPlanStructure = JSON.parse(response.output[1].arguments);
      return aiWorkoutPlanStructure;
    }

    return null;
  }
}

export default new OpenAIApiService();
