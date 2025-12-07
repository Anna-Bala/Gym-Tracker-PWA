import { useActionState, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, UserPersonalInfoSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert } from "@/components/Alert";
import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handleProfileSettingSave } from "./actions";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import { useAuth } from "@/contexts/auth/useAuth";
import Bin from "@icons/bin.svg?react";
import Chevron from "@icons/chevron.svg?react";
import Locked from "@icons/locked.svg?react";

type ProfileSettingsFormData = z.infer<typeof UserPersonalInfoSchema>;

const ProfileSettings = () => {
  const { refreshUser, user } = useAuth();

  const form = useForm<ProfileSettingsFormData>({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    },
    resolver: zodResolver(UserPersonalInfoSchema),
  });

  const {
    formState: { isDirty, errors },
  } = form;

  const [state, submitAction, isPending] = useActionState(handleProfileSettingSave, { success: null });

  useEffect(() => {
    if (state.success) refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <section className="flex flex-col h-[90vh]">
      <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isPending} />

      <Typography className="w-full text-center font-semibold" variant="h2">
        Profile & Security
      </Typography>

      {state.success === false && (
        <Alert
          className="mt-4"
          title="Unable to update personal info"
          description="Updating your account information failed. Please check your inputs and try again."
          icon={<CircleAlert />}
          variant="destructive"
        />
      )}

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
          <Button className="w-full mt-6" disabled={!isDirty} type="submit">
            Save
          </Button>
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
    </section>
  );
};

export default ProfileSettings;
