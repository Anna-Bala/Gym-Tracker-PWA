import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { type WorkoutPlanDay } from "@gym-tracker-pwa/schemas";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

import { Alert } from "@/components/Alert";
import { authFetch } from "@/lib/fetchClient";
import { Button, Input } from "@/components/ui";
import { CheckboxCardItem } from "@/components/CheckboxCardItem";
import { daysOptions } from "./constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader } from "@/components/Loader";
import { MobileHeaderNavigation } from "@/components/MobileHeaderNavigation";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/base/Typography";
import { useWorkoutPlanForm } from "@/contexts/workoutPlan/useWorkoutPlanForm";
import Bin from "@icons/bin.svg?react";
import WorkoutPlanExercisesDrawer from "./WorkoutPlanExercisesDrawer";

const WorkoutPlanForm = () => {
  const [isExercisesDrawerOpen, setIsExercisesDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const toggleIsExercisesDrawerOpen = () => setIsExercisesDrawerOpen((prevState) => !prevState);

  const { exercisesFields, form, isEdit, removeExercise } = useWorkoutPlanForm();

  const {
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const location = useLocation();

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleWorkoutPlanCreation = form.handleSubmit((data) => {
    setErrorMessage(null);
    authFetch("/workout-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Workout plan creation failed. Please try again or check your inputs.");
          return;
        }

        navigate("/home");
        toast.success("Your workout plan have been created successfully.");
      })
      .catch(() => setErrorMessage(null));
  });

  const handleWorkoutPlanUpdate = form.handleSubmit((data) => {
    setErrorMessage(null);
    authFetch(`/workout-plans/${location.state.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          setErrorMessage("Updating your workout plan failed. Please try again or check your inputs.");
          return;
        }

        navigate("/home");
        toast.success("Your workout plan have been updated successfully.");
      })
      .catch(() => setErrorMessage(null));
  });

  return (
    <section className="flex flex-col pb-24">
      <Loader variant="full-screen" isLoading={isSubmitting} color="white" />
      <MobileHeaderNavigation centerText headerText={`${isEdit ? "Edit" : "Create"} Workout Plan`} />
      <Typography className="mt-4 font-light" variant="md-24">
        {isEdit ? "Edit your workout plan by changing it's name, description, schedule or replacing exercises." : "Create a personalized workout plan by choosing exercises, sets, and schedule."}
      </Typography>
      {errorMessage && <Alert className="mt-4" description={errorMessage} icon={<CircleAlert />} title="Unable to save Workout Plan" variant="destructive" />}
      <Form {...form}>
        <form className="w-full flex flex-col gap-4 mt-6" onSubmit={isEdit ? handleWorkoutPlanUpdate : handleWorkoutPlanCreation} noValidate>
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
                {errors.description && <FormMessage>{errors.description.message}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Schedule</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {daysOptions.map((option) => (
                      <CheckboxCardItem
                        className="w-fit p-3"
                        key={option.value}
                        onCheckedChange={(checked) => {
                          const newValue = checked ? [...(field.value || []), option.value] : field.value.filter((value) => value !== option.value);
                          field.onChange(newValue);
                        }}
                        checked={field.value?.includes(option.value as WorkoutPlanDay)}
                        {...option}
                      />
                    ))}
                  </div>
                </FormControl>
                {errors.days && <FormMessage>{errors.days.message}</FormMessage>}
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
                <Button className="mt-3" variant="default" type="button" onClick={toggleIsExercisesDrawerOpen}>
                  Add first exercise
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2 pb-36">
                {exercisesFields.map((exercise, index) => (
                  <div className="flex justify-between items-center bg-card border border-border p-3 rounded-md" key={exercise.id}>
                    <div className="flex flex-col gap-1">
                      <Typography className="font-medium text-left text-card-foreground" variant="md-20">
                        {exercise.name}
                      </Typography>
                      <div className="flex gap-2">
                        <Typography className="font-light text-left text-card-foreground" variant="sm-20">
                          Sets: {exercise.sets}
                        </Typography>

                        <Typography className="font-light text-left text-card-foreground" variant="sm-20">
                          Reps: {exercise.reps}
                        </Typography>
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => removeExercise(index)} type="button">
                      <Bin className="!w-8 !h-8 text-destructive" />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-between fixed bottom-[90px] box-border right-0 left-0 px-4 gap-4 py-4 bg-background z-20">
                  <Button className="!flex-1" variant="secondary" onClick={toggleIsExercisesDrawerOpen} type="button">
                    Add more exercises
                  </Button>
                  <Button className="!flex-1" type="submit">
                    {isEdit ? "Save" : "Create"} workout plan
                  </Button>
                </div>
              </div>
            )}
          </div>

          <WorkoutPlanExercisesDrawer isOpen={isExercisesDrawerOpen} onClose={toggleIsExercisesDrawerOpen} />
        </form>
      </Form>
    </section>
  );
};

export default WorkoutPlanForm;
