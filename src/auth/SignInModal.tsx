import { useState } from "react";
import { Modal } from "@/components/Modal";

import RegisterUserForm from "./RegisterUserForm";
import LoginForm from "./LoginForm";
import { Button } from "@/components/ui/button";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export default function SignInModal({
  isOpen,
  onClose,
  loading,
}: SignInModalProps) {
  const [alreadyUser, setAlreadyUser] = useState(true);

  function toggleForm() {
    setAlreadyUser((prev) => !prev);
  }

  const switchForm = alreadyUser ? (
    <div className="text-muted-foreground">
      Not a user yet?
      <Button
        variant="linkHover2"
        onClick={toggleForm}
        className="ml-1.5 h-fit cursor-pointer px-0 text-muted-foreground after:w-full hover:text-primary"
      >
        Sign up
      </Button>
      &nbsp;first
    </div>
  ) : (
    <div className="text-muted-foreground">
      Already have an account?
      <Button
        variant="linkHover2"
        onClick={toggleForm}
        className="ml-1.5 h-fit cursor-pointer px-0 text-muted-foreground after:w-full hover:text-primary"
      >
        Log in
      </Button>
      &nbsp;here
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
          <LoginForm loading={loading} onClose={onClose} />
        ) : (
          <RegisterUserForm loading={loading} setAlreadyUser={setAlreadyUser} />
        )}
      </div>
    </Modal>
  );
}
