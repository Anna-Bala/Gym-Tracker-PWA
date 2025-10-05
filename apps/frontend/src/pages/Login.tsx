import { useActionState, startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CircleAlert, Smile } from "lucide-react";
import { z, LoginSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { API_ENDPOINT_PREFIX } from "@/secrets";
import { Alert } from "@/components/Alert";
import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";

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
    handleSubmit,
  } = form;

  const navigate = useNavigate();

  const handleFormSubmission = async (_prevState: object, data: FormData) => {
    try {
      const formData = Object.fromEntries(data);
      const response = await fetch(`${API_ENDPOINT_PREFIX}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) return { success: false };

      navigate("/");
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const [state, submitAction, isPending] = useActionState(handleFormSubmission, { success: true });

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      submitAction(formData);
    });
  };

  return (
    <section>
      <Loader variant="full-screen" isLoading={isPending} color="white" />
      <Typography className="font-bold flex flex-row items-center w-full gap-4" variant="h2">
        Welcome Back! <Smile width={30} height={30} strokeWidth={3} absoluteStrokeWidth={true} />
      </Typography>
      <Typography className="mt-2 font-light" variant="md-24">
        Sign in to access your personalized workouts and track your progress.
      </Typography>
      {!state.success && (
        <Alert className="mt-4" description="Login attempt failed. Make sure your account exists and your details are correct." icon={<CircleAlert />} title="Unable to Log In" variant="destructive" />
      )}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="w-full flex flex-col gap-4 mt-6">
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
          <div className="flex w-full fixed bottom-0 left-0 px-6 py-4 bg-background border-t border-muted shadow-wide-xl">
            <Button className="w-full" type="submit">
              Log in
            </Button>
          </div>
        </form>
      </Form>
      <Typography className="mt-8 font-light text-center" variant="sm-20">
        Don't have an account?
        <Button className="pl-3" variant="link" asChild>
          <Link to="/registration">Register now</Link>
        </Button>
      </Typography>
    </section>
  );
};

export default Login;
