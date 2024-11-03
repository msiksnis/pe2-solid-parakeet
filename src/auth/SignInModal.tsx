import { useState } from "react";
import { Modal } from "@/components/Modal";

import RegisterUserForm from "./RegisterUserForm";
import LoginForm from "./LoginForm";
import { Button } from "@/components/ui/button";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onConfirm is optional
  onConfirm?: () => void;
  loading: boolean;
}

export default function SignInModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: SignInModalProps) {
  const [alreadyUser, setAlreadyUser] = useState(true);

  function toggleForm() {
    setAlreadyUser((prev) => !prev);
  }

  const switchForm = alreadyUser ? (
    <div className="text-muted-foreground">
      Not a user yet?&nbsp;
      <Button
        variant="link"
        onClick={toggleForm}
        className="h-fit cursor-pointer p-1 text-muted-foreground hover:text-primary"
      >
        Sign up
      </Button>
    </div>
  ) : (
    <div className="text-muted-foreground">
      Already have an account?&nbsp;
      <Button
        variant="link"
        onClick={toggleForm}
        className="h-fit cursor-pointer p-1 text-muted-foreground hover:text-primary"
      >
        Log in
      </Button>
    </div>
  );

  const titleMessage = alreadyUser
    ? "Log in to your account"
    : "Create new account";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="border-b pb-2">
        <h2 className="text-2xl font-semibold">{titleMessage}</h2>
        <div className="text-sm">{switchForm}</div>
      </div>

      <div className="mt-4">
        {alreadyUser ? (
          <LoginForm onConfirm={onConfirm} loading={loading} />
        ) : (
          <RegisterUserForm loading={loading} setAlreadyUser={setAlreadyUser} />
        )}
      </div>
    </Modal>
  );
}

{
  /* <div className="flex w-full items-center justify-end space-x-2 pt-6">
  <Button
    variant="outline"
    size="lg"
    disabled={loading}
    onClick={onClose}
    className="font-normal"
  >
    Cancel
  </Button>
  <Button
    variant="destructive"
    size="lg"
    disabled={loading}
    onClick={onConfirm}
    className="bg-red-500 font-normal text-white hover:bg-red-600"
  >
    Delete
  </Button>
</div> */
}
