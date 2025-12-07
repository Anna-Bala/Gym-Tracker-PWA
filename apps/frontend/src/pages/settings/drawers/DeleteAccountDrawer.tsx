import { useState } from "react";
import { CircleAlert } from "lucide-react";

import { Alert } from "@/components/Alert";
import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui";
import { Drawer } from "@/components/Drawer";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import { useAuth } from "@/contexts/auth/useAuth";

interface DeleteAccountDrawerProps {
  handleClose: () => void;
  isOpen: boolean;
}

const DeleteAccountDrawer = ({ handleClose, isOpen }: DeleteAccountDrawerProps) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { unauthorizeUser } = useAuth();

  const handleAccountDeletion = async () => {
    setIsLoading(true);
    setIsError(false);

    await authFetch("/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then(() => {
        unauthorizeUser();
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onAnimationEnd={handleClose}
      footerContent={
        <div className="flex gap-4 w-full mt-1">
          <Button className="flex-1" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="flex-1" variant="destructive" onClick={handleAccountDeletion}>
            Delete
            <Loader color="white" variant="inline" isLoading={isLoading} />
          </Button>
        </div>
      }
    >
      <div className="flex flex-col w-full">
        <Typography className="font-semibold text-center" variant="h3">
          Are you sure you want to delete your account?
        </Typography>
        <Typography className="px-2 text-muted-foreground mt-4" variant="sm-20">
          By deleting your account, you will lose all your data. You will not be able to retrieve your account afterward.
        </Typography>

        {isError && <Alert className="mt-4" title="Unable to Delete Account" description="Account deletion failed. Please try again later." icon={<CircleAlert />} variant="destructive" />}
      </div>
    </Drawer>
  );
};

export default DeleteAccountDrawer;
