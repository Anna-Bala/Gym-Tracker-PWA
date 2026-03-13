import { useActionState, useEffect } from "react";
import { CircleAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z, LoginSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert } from "@/components/Alert";
import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handleLoginAction } from "./actions";
import { Loader } from "@/components/Loader";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
import { Typography } from "@/components/base/Typography";
import { useAuth } from "@/contexts/auth/useAuth";
import GoogleAuth from "./GoogleAuth";

type LoginFormData = z.infer<typeof LoginSchema>;

const Login = () => {
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const {
    formState: { errors },
  } = form;

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [state, submitAction, isPending] = useActionState(handleLoginAction, { success: null, onboardingFilled: undefined });

  useEffect(() => {
    if (state.success) {
      refreshUser();

      if (state.onboardingFilled) {
        navigate("/home");
      } else {
        navigate("/onboarding/1");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <ResponsivePageShell className="lg:max-w-[920px] lg:mx-auto" contentClassName="w-full lg:max-w-[560px] lg:!m-auto" hideMobileBackButton>
      <Loader variant="full-screen" isLoading={isPending} color="white" />

      <Typography className="text-foreground font-extrabold text-center" variant="h2">
        Welcome back!
      </Typography>

      <Typography className="mt-1 mb-10 font-light text-center lg:mb-4" variant="md-24">
        Sign in to access your personalized workouts and track your progress.
      </Typography>

      <div className="lg:rounded-2xl lg:border lg:border-border/80 lg:bg-gradient-to-b lg:from-card lg:to-muted/20 lg:p-6 lg:shadow-wide-xs">
        {state.success === false && (
          <Alert
            className="my-4 lg:mt-0"
            description="Login attempt failed. Make sure your account exists and your details are correct."
            icon={<CircleAlert />}
            title="Unable to Log In"
            variant="destructive"
          />
        )}
        <Form {...form}>
          <form action={submitAction} noValidate>
            <div className="w-full flex flex-col gap-4">
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
                      <Input placeholder="Enter your password" type="password" {...field} />
                    </FormControl>
                    {errors.password && <FormMessage>{errors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4 w-full fixed bottom-0 left-0 px-6 py-4 bg-background/95 border-t border-border shadow-wide-lg backdrop-blur lg:bg-transparent lg:static lg:shadow-none lg:mt-4 lg:border-none lg:backdrop-blur-none lg:px-0 lg:py-0">
              <Button className="w-full" type="submit">
                Log in
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
                Don't have an account?
                <Button className="pl-3" variant="link" asChild>
                  <Link to="/registration">Register now</Link>
                </Button>
              </Typography>
            </div>
          </form>
        </Form>
      </div>
    </ResponsivePageShell>
  );
};

export default Login;
