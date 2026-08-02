import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../../hooks/useLogin";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import type { FormEvent } from "react";

/** Modal dialog for user login. Redirects to home on success, or closes if opened in-context. */
export const LoginModal = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const mail = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;
    login(mail, password, () => setOpen(false));
  };

  const hasError = Boolean(error);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        navigate(-1);
      }}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-zinc-950/75 transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-zinc-950 border-none shadow-lg shadow-amber-900/50 rounded-lg w-96 p-6">
          <button
            onClick={() => {
              setOpen(false);
              navigate(-1);
            }}
            aria-label="Fermer le modal"
            className="absolute top-2 right-2 text-zinc-100 hover:text-red-500 text-2xl cursor-pointer"
          >
            ×
          </button>

          <DialogTitle className="text-xl font-bold text-zinc-100">
            Connexion
          </DialogTitle>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col space-y-3"
          >
            <Input type="email" required placeholder="Email" error={hasError} />
            <Input
              type="password"
              required
              placeholder="Mot de passe"
              error={hasError}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <p className="mt-3 text-sm text-zinc-100 text-center">
            Pas encore inscrit ?{" "}
            <Link to="/register" className="text-amber-600 hover:underline">
              Créez un compte ici
            </Link>
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
