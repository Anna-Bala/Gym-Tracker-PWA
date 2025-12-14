import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { z, UserCreatedWorkoutPlanSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert } from "@/components/Alert";
import { Button, Input } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";

type WorkoutPlanFormData = z.infer<typeof UserCreatedWorkoutPlanSchema>;

const WorkoutPlanForm = () => {
  const form = useForm<WorkoutPlanFormData>({
    defaultValues: {
      name: "",
      description: "",
      exercises: [],
    },
    resolver: zodResolver(UserCreatedWorkoutPlanSchema),
  });

  const {
    formState: { errors },
  } = form;

  const { fields: exercisesFields, append: appendExercise, remove: removeExercise } = useFieldArray({ control: form.control, name: "exercises" });

  console.log({ exercisesFields });

  const navigate = useNavigate();

  const [state, submitAction, isPending] = useActionState(() => {}, { success: null });

  return (
    <section>
      <Loader variant="full-screen" isLoading={isPending} color="white" />
      <Typography className="font-bold flex flex-row items-center w-full gap-4" variant="h2">
        Create Workout Plan
      </Typography>
      <Typography className="mt-2 font-light" variant="md-24">
        Create a personalized workout plan by choosing exercises, sets, and schedule.
      </Typography>
      {/* {state.success === false && (
        <Alert className="mt-4" description="Login attempt failed. Make sure your account exists and your details are correct." icon={<CircleAlert />} title="Unable to Log In" variant="destructive" />
      )} */}
      <Form {...form}>
        <form className="w-full flex flex-col gap-4 mt-6" action={submitAction} noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder="Upper Body Strength" type="text" {...field} />
                </FormControl>
                {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Focuses on compound lifts with moderate volume." {...field} />
                </FormControl>
                {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
              </FormItem>
            )}
          />

          <div className="flex flex-col">
            <FormLabel>Exercises</FormLabel>

            {exercisesFields.length === 0 ? (
              <>
                <Typography className="w-full font-normal text-muted-foreground mt-2" variant="sm-20">
                  You didn't add any exercise yet
                </Typography>
                <Button className="mt-3" variant="default">
                  Add first exercise
                </Button>
              </>
            ) : null}
          </div>
        </form>
      </Form>
    </section>
  );
};

export default WorkoutPlanForm;
