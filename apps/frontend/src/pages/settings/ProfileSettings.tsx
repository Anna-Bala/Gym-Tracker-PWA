import { useActionState, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, UserPersonalInfoSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { API_ENDPOINT_PREFIX } from "@/secrets";
import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import { useAuth } from "@/contexts/auth/useAuth";
import Bin from "@icons/bin.svg?react";
import Chevron from "@icons/chevron.svg?react";
import Locked from "@icons/locked.svg?react";

type ProfileSettingsFormData = z.infer<typeof UserPersonalInfoSchema>;

const ProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileSettingsFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    resolver: zodResolver(UserPersonalInfoSchema),
  });

  const {
    formState: { errors },
    reset,
  } = form;

  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    const fetchUserOnboardingData = async () => {
      await fetch(`${API_ENDPOINT_PREFIX}/user`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(async (response) => {
          const responseData = await response.json();
          reset(responseData);
        })
        .finally(() => setIsLoading(false));
    };

    fetchUserOnboardingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const [state, submitAction, isPending] = useActionState(() => {}, { success: null });

  return (
    <section className="flex flex-col h-[90vh]">
      <Typography className="w-full text-center font-semibold" variant="h2">
        Profile & Security
      </Typography>

      {isLoading ? (
        <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isLoading} />
      ) : (
        <>
          <Typography className="w-full font-semibold mt-6" variant="h4">
            Personal Info
          </Typography>

          <Form {...form}>
            <form action={submitAction} noValidate>
              <div className="w-full flex flex-col gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {errors.firstName && <FormMessage>{errors.firstName.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {errors.lastName && <FormMessage>{errors.lastName.message}</FormMessage>}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full fixed bottom-0 left-0 px-6 py-4 bg-background border-t border-muted shadow-wide-xl">
                <Button className="w-full" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>

          <Typography className="w-full font-semibold mt-6" variant="h4">
            Account security
          </Typography>

          <Link className="text-base flex items-center !px-0 justify-start text-foreground py-2 gap-4 font-medium mt-1" to="/settings/profile/password">
            <>
              <Locked className="!w-10 !h-10 text-foreground" />
              <Typography variant="md-24">Change password</Typography>
              <Chevron className="!w-6 !h-6 rotate-180 ml-auto mr-2" />
            </>
          </Link>

          <Button className="w-full text-base !p-0 text-destructive justify-center gap-4 mt-3" variant="link" size="lg" onClick={() => {}}>
            <>
              <Bin className="!w-10 !h-10 text-destructive" />
              Delete account
              <Chevron className="!w-6 !h-6 rotate-180 ml-auto mr-2" />
            </>
          </Button>
          <Typography className="px-2 text-muted-foreground" variant="sm-20">
            Permanently remove your account and data. Proceed with caution.
          </Typography>
        </>
      )}
    </section>
  );
};

export default ProfileSettings;
