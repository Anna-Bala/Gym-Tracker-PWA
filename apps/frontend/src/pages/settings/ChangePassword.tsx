import { useActionState, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, ChangePasswordWithConfirmationSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert } from "@/components/Alert";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
import { Typography } from "@/components/base/Typography";
import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handleChangePasswordAction } from "./actions";
import { Loader } from "@/components/Loader";

type ChangePasswordFormData = z.infer<typeof ChangePasswordWithConfirmationSchema>;

const ChangePassword = () => {
  const form = useForm<ChangePasswordFormData>({
    defaultValues: {
      confirmNewPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(ChangePasswordWithConfirmationSchema),
  });

  const {
    formState: { errors },
  } = form;

  const navigate = useNavigate();

  const [state, submitAction, isPending] = useActionState(handleChangePasswordAction, { success: null });

  useEffect(() => {
    if (state.success) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ResponsivePageShell title="Change Password">
      <Loader variant="full-screen" isLoading={isPending} color="white" />

      {state.success === false && (
        <Alert
          className="my-4"
          title="Unable to change password"
          description="Password update failed. Please ensure your current password is correct and your new password meets all requirements."
          icon={<CircleAlert />}
          variant="destructive"
        />
      )}

      <div className="w-full xl:max-w-[760px] xl:mx-auto xl:rounded-2xl xl:border xl:border-border/80 xl:bg-gradient-to-b xl:from-card xl:to-muted/20 xl:p-6 xl:shadow-wide-xs">
        <Typography className="text-muted-foreground" variant="sm-20">
          Use a password with at least 8 characters, including uppercase, lowercase, a number, and a special character.
        </Typography>

        <Form {...form}>
          <form action={submitAction} noValidate>
            <div className="w-full flex flex-col gap-4 mt-5">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    {errors.currentPassword && <FormMessage>{errors.currentPassword.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    {errors.newPassword && <FormMessage>{errors.newPassword.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    {errors.confirmNewPassword && <FormMessage>{errors.confirmNewPassword.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full mt-6" type="submit">
              Change password
            </Button>
          </form>
        </Form>
      </div>
    </ResponsivePageShell>
  );
};

export default ChangePassword;
