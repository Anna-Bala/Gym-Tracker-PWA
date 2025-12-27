import { useActionState, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z, ChangePasswordWithConfirmationSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert } from "@/components/Alert";
import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handleChangePasswordAction } from "./actions";
import { Loader } from "@/components/Loader";
import { MobileHeaderNavigation } from "@/components/MobileHeaderNavigation";
import { Typography } from "@/components/base/Typography";

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
    <section className="flex flex-col h-[90vh]">
      <Loader variant="full-screen" isLoading={isPending} color="white" />

      <MobileHeaderNavigation centerText headerText="Change Password" />

      <Typography className="mt-4 mb-2 font-light" variant="md-24">
        To change your password, please fill in the fields below. Your password must contain at least 8 characters, it must also include at least one upper case letter, one lower case letter, one
        number and one special character.
      </Typography>

      {state.success === false && (
        <Alert
          className="mt-4"
          title="Unable to change password"
          description="Password update failed. Please ensure your current password is correct and your new password meets all requirements."
          icon={<CircleAlert />}
          variant="destructive"
        />
      )}

      <Form {...form}>
        <form action={submitAction} noValidate>
          <div className="w-full flex flex-col gap-4 mt-4">
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
    </section>
  );
};

export default ChangePassword;
