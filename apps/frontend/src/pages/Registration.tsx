import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { z, SignupSchema } from "@gym-tracker-pwa/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button, Input } from "@/components/ui";
import { Typography } from "@/components/base/Typography";

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

  const onSubmit = async (values: RegistrationFormData) => {
    console.log({ values });
  };

  const {
    formState: { errors },
  } = form;

  return (
    <section>
      <Typography className="font-bold flex flex-row items-center w-full gap-4" variant="h2">
        Create Your Account <User width={30} height={30} strokeWidth={3} absoluteStrokeWidth={true} />
      </Typography>
      <Typography className="mt-2 font-light" variant="md-24">
        Sign up now to get access to personalized workouts and achieve your fitness goals.
      </Typography>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col gap-4 mt-6">
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
          <div className="flex w-full fixed bottom-0 left-0 px-6 py-4 bg-background border-t border-muted shadow-wide-xl">
            <Button className="w-full">Sign up</Button>
          </div>
        </form>
      </Form>
      <Typography className="mt-8 font-light text-center" variant="sm-20">
        Already have an account?
        <Button className="pl-3" variant="link" asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </Typography>
    </section>
  );
};

export default Registration;
