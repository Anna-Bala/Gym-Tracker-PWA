import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import Paper from "@icons/paper.svg?react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userWorkoutPlans, setUserWorkoutPlans] = useState([]);

  useEffect(() => {
    const fetchUserWorkoutPlans = async () => {
      await authFetch("/workout-plans", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(async (response) => {
          const responseData = await response.json();
          setUserWorkoutPlans(responseData);
        })
        .finally(() => setIsLoading(false));
    };

    fetchUserWorkoutPlans();
  }, []);

  return (
    <section className="flex flex-col h-[90vh] pb-24">
      <Typography className="w-full text-center font-semibold" variant="h2">
        Gym Tracker
      </Typography>

      {isLoading ? (
        <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isLoading} />
      ) : (
        <>
          <Typography className="w-full font-semibold mt-6" variant="h4">
            Your Workout Plans
          </Typography>
          {userWorkoutPlans.length === 0 ? (
            <>
              <Paper className="!w-24 !h-24  mt-4 text-primary mx-auto" />{" "}
              <Typography className="w-full text-center font-normal text-muted-foreground mt-2" variant="md-20">
                You haven't created any workout plans yet
              </Typography>
              <Typography className="w-full text-center font-normal text-muted-foreground mt-1" variant="sm-20">
                Create your own workout plans for routines you already love or want full control over.
              </Typography>
              <Button className="mt-3" variant="default" asChild>
                <Link to="/workout-plan">Create your workout plan</Link>
              </Button>
            </>
          ) : null}
        </>
      )}
    </section>
  );
};

export default Home;
