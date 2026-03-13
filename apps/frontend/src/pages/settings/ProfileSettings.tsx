import { useActionState, useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z, UserPersonalInfoSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert } from "@/components/Alert";
import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handleProfileSettingSave } from "./actions";
import { Loader } from "@/components/Loader";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
import { Typography } from "@/components/base/Typography";
import { useAuth } from "@/contexts/auth/useAuth";
import Bin from "@icons/bin.svg?react";
import Chevron from "@icons/chevron.svg?react";
import DeleteAccountDrawer from "./drawers/DeleteAccountDrawer";
import Locked from "@icons/locked.svg?react";

type ProfileSettingsFormData = z.infer<typeof UserPersonalInfoSchema>;

const ProfileSettings = () => {
  const [isDeleteAccountDrawerOpen, setIsDeleteAccountDrawerOpen] = useState(false);

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
    if (state.success) {
      toast.success("Your changes have been saved successfully.");
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ResponsivePageShell title="Profile & Security">
      <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isPending} />

      {state.success === false && (
        <Alert
          className="my-4"
          title="Unable to update personal info"
          description="Updating your account information failed. Please check your inputs and try again."
          icon={<CircleAlert />}
          variant="destructive"
        />
      )}

      <div className="flex flex-col gap-6 xl:gap-7">
        <div className="xl:rounded-2xl xl:border xl:border-border/80 xl:bg-gradient-to-b xl:from-card xl:to-muted/20 xl:p-5 xl:shadow-wide-xs">
          <Typography className="w-full font-semibold" variant="h4">
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
        </div>

        <div className="xl:rounded-2xl xl:p-5 xl:sticky xl:top-24">
          <Typography className="w-full font-semibold" variant="h4">
            Account security
          </Typography>
          <Link
            className="text-base flex items-center justify-start text-foreground p-3 gap-4 font-medium mt-2 rounded-2xl border border-border bg-card/90 shadow-compact-xs transition-[border-color,background-color,box-shadow] hover:bg-accent/60 hover:border-primary/35 hover:shadow-compact-md cursor-pointer"
            to="/settings/profile/password"
          >
            <>
              <Locked className="!w-10 !h-10 text-foreground" />
              <Typography variant="md-24">Change password</Typography>
              <Chevron className="!w-6 !h-6 rotate-180 ml-auto mr-2 stroke-[3]" />
            </>
          </Link>

          <Button className="w-full justify-start text-destructive p-3 gap-4 mt-3 rounded-2xl border-destructive/40 h-auto" variant="outline" onClick={() => setIsDeleteAccountDrawerOpen(true)}>
            <Bin className="!w-10 !h-10 text-destructive" />
            <Typography variant="md-24">Delete account</Typography>
            <Chevron className="!w-6 !h-6 rotate-180 ml-auto mr-2 stroke-[3]" />
          </Button>
          <Typography className="px-2 mt-2 text-muted-foreground" variant="sm-20">
            Permanently remove your account and data. Proceed with caution.
          </Typography>
        </div>
      </div>

      <DeleteAccountDrawer isOpen={isDeleteAccountDrawerOpen} handleClose={() => setIsDeleteAccountDrawerOpen(false)} />
    </ResponsivePageShell>
  );
};

export default ProfileSettings;
