import { useActionState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CircleAlert } from "lucide-react";
import { z, SignupSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert } from "@/components/Alert";
import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handleRegistrationAction } from "./actions";
import { Loader } from "@/components/Loader";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
import { Typography } from "@/components/base/Typography";
import GoogleAuth from "./GoogleAuth";

type RegistrationFormData = z.infer<typeof SignupSchema>;

const Registration = () => {
  const form = useForm<RegistrationFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(SignupSchema),
  });

  const {
    formState: { errors },
  } = form;

  const navigate = useNavigate();

  const [state, submitAction, isPending] = useActionState(handleRegistrationAction, { success: null });

  useEffect(() => {
    if (state.success) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ResponsivePageShell className="lg:max-w-[920px] lg:mx-auto" contentClassName="w-full mb-[150px] sm:mb-0 lg:max-w-[560px] lg:!m-auto" hideMobileBackButton>
      <Loader variant="full-screen" isLoading={isPending} color="white" />

      <Typography className="text-foreground font-extrabold text-center " variant="h2">
        Create account
      </Typography>

      <Typography className="mt-1 font-light text-center mb-10 lg:mb-4" variant="md-24">
        Sign up now to get access to personalized workouts and achieve your fitness goals.
      </Typography>

      <div className="lg:rounded-2xl lg:border lg:border-border/80 lg:bg-gradient-to-b lg:from-card lg:to-muted/20 lg:p-6 lg:shadow-wide-xs">
        {state.success === false && (
          <Alert className="my-4" description="An error occurred while creating your account. Please try again later." icon={<CircleAlert />} title="Account Creation Error" variant="destructive" />
        )}
        <Form {...form}>
          <form action={submitAction} noValidate>
            <div className="w-full flex flex-col gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
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
                      <Input placeholder="Enter your last name" {...field} />
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
                      <Input placeholder="hello@example.com" type="email" {...field} />
                    </FormControl>
                    {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Create a strong password" type="password" {...field} />
                    </FormControl>
                    {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Re-enter your password" type="password" {...field} />
                    </FormControl>
                    {errors.confirmPassword && <FormMessage>{errors.confirmPassword.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 w-full fixed bottom-0 left-0 px-6 py-4 bg-background/95 border-t border-border shadow-wide-lg backdrop-blur lg:bg-transparent lg:static lg:shadow-none lg:mt-4 lg:border-none lg:backdrop-blur-none lg:px-0 lg:py-0">
              <Button className="w-full" type="submit">
                Sign up
              </Button>

              <div className="flex items-center w-full">
                <hr className="border-border w-full" />
                <Typography className="font-light px-4 text-muted-foreground" variant="sm-20">
                  or
                </Typography>
                <hr className="border-border w-full" />
              </div>

              <GoogleAuth />

              <Typography className="mt-2 font-light text-center text-muted-foreground" variant="sm-20">
                Already have an account?
                <Button className="pl-3" variant="link" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
              </Typography>
            </div>
          </form>
        </Form>
      </div>
    </ResponsivePageShell>
  );
};

export default Registration;
