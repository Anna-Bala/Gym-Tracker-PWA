import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { z, FilterExercisesSchema, SearchExercisesSchema, type Exercise } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui";
import { CheckboxCardItem } from "@/components/CheckboxCardItem";
import { discoverExercisesFilterFields } from "./constants";
import { Drawer } from "@/components/Drawer";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SectionCard } from "@/components/base/SectionCard";
import { Typography } from "@/components/base/Typography";
import MagnifyingGlass from "@icons/magnifying-glass.svg?react";
import useDebounce from "@/hooks/useDebounce";

const ExercisesFilterSchema = FilterExercisesSchema.merge(SearchExercisesSchema);

type ExercisesFilterFormData = z.infer<typeof ExercisesFilterSchema>;

interface ExercisesFilterProps {
  setExercisesList: React.Dispatch<React.SetStateAction<Exercise[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExercisesFilter = ({ setExercisesList, setIsLoading }: ExercisesFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const form = useForm<ExercisesFilterFormData>({
    defaultValues: {
      categories: undefined,
      muscles: undefined,
      types: undefined,
      name: undefined,
    },
    resolver: zodResolver(ExercisesFilterSchema),
  });

  const { getValues, watch } = form;

  const handleFilterRequest = async () => {
    setIsLoading(true);

    const values = getValues();
    const { categories, muscles, name, types } = values;

    await authFetch("/exercises/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ categories, muscles, types, name }),
    })
      .then(async (response) => {
        const responseData = await response.json();
        setExercisesList(responseData);
      })
      .finally(() => {
        setIsLoading(false);
        setIsFilterOpen(false);
      });
  };

  const debouncedSearchFieldValue = useDebounce(watch("name"), 1800);

  const handleSearchFieldRequest = async (value: string) => {
    await authFetch("/exercises/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: value }),
    })
      .then(async (response) => {
        const responseData = await response.json();
        setExercisesList(responseData);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!debouncedSearchFieldValue) return;
    handleSearchFieldRequest(debouncedSearchFieldValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchFieldValue]);

  const toggleFilterPanelOpen = () => setIsFilterOpen((prevState) => !prevState);

  return (
    <Form {...form}>
      <form noValidate>
        <Drawer className="px-5" isOpen={isFilterOpen} onAnimationEnd={() => setIsFilterOpen(false)} footerContent={<Button onClick={handleFilterRequest}>Apply filter</Button>}>
          <div className="flex flex-row justify-between px-1 w-full">
            <Typography className="font-semibold" variant="h3">
              Filter
            </Typography>
            <Button className="pr-0 text-muted-foreground lg:pr-4" variant="ghost" onClick={toggleFilterPanelOpen}>
              Close
            </Button>
          </div>
          <div className="flex flex-col mt-6 gap-6 p-1 overflow-auto scrollbar-none">
            {discoverExercisesFilterFields.map((formField) => (
              <div className="flex flex-col gap-4" key={formField.name}>
                <Typography className="font-semibold" variant="h3">
                  {formField.title}
                </Typography>
                <FormField
                  control={form.control}
                  name={formField.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-wrap gap-3">
                          {formField.options.map((option) => (
                            <CheckboxCardItem
                              className="w-fit py-2"
                              key={option.value}
                              onCheckedChange={(checked) => {
                                const newValue = checked ? [...(field.value || []), option.value] : field.value?.filter((value) => value !== option.value);
                                field.onChange(newValue);
                              }}
                              checked={(field.value as string[])?.includes(option.value)}
                              {...option}
                            />
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </Drawer>
        <SectionCard className="mt-6 p-3 md:p-4">
          <div className="flex w-full items-center gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <InputGroup className="h-12">
                      <InputGroupAddon>
                        <MagnifyingGlass className="!h-5 !w-5" />
                      </InputGroupAddon>
                      <InputGroupInput placeholder="Search exercise..." onChange={field.onChange} />
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="shrink-0" variant="outline" onClick={toggleFilterPanelOpen} type="button">
              <Filter className="!h-4 !w-4" />
              Filter
            </Button>
          </div>
        </SectionCard>
      </form>
    </Form>
  );
};

export default ExercisesFilter;
