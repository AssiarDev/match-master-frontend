import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../../hooks/useRegister";
import { Button } from "../../UI/Button/Button";
import { Input } from "../../UI/Input/Input";
import type { FormEvent } from "react";

/** Modal dialog for user registration. Validates password confirmation and redirects to login on success. */
export const RegisterModal = () => {
  const [open, setOpen] = useState(true);
  const [consentChecked, setConsentChecked] = useState(false);
  const [areFieldsFilled, setAreFieldsFilled] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();

  const handleFormInput = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;
    setAreFieldsFilled(
      username.trim() !== "" &&
        email.trim() !== "" &&
        password !== "" &&
        confirmPassword !== "",
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      setConfirmError("Les mots de passe ne correspondent pas.");
      return;
    }
    setConfirmError("");
    register(username, email, password, confirmPassword, () => setOpen(false));
  };

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-zinc-950/75 transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-zinc-950 border-none shadow-lg shadow-amber-900/50 rounded-lg w-96 p-6">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-zinc-100 hover:text-red-500 text-2xl cursor-pointer"
          >
            ×
          </button>

          <DialogTitle className="text-xl font-bold text-zinc-100">
            Inscription
          </DialogTitle>

          <form
            onSubmit={handleSubmit}
            onInput={handleFormInput}
            className="mt-4 flex flex-col space-y-3"
          >
            <Input
              type="text"
              name="username"
              required
              placeholder="Nom d'utilisateur"
            />
            <Input type="email" name="email" required placeholder="Email" />
            <Input type="password" name="password" placeholder="Mot de passe" />
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• 8 caractères minimum</li>
              <li>• 1 majuscule requise</li>
              <li>• 1 chiffre requis</li>
              <li>• 1 caractère spécial requis</li>
            </ul>
            <div>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirmez le mot de passe"
                error={Boolean(confirmError)}
              />
              {confirmError && (
                <p className="text-red-500 text-xs mt-1">{confirmError}</p>
              )}
            </div>

            <label
              className={`flex items-start gap-2 text-sm ${
                areFieldsFilled
                  ? "text-zinc-300 cursor-pointer"
                  : "text-zinc-500 cursor-not-allowed"
              }`}
            >
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                disabled={!areFieldsFilled}
                className="mt-0.5 accent-amber-500 disabled:cursor-not-allowed"
              />
              <span>
                J'accepte la{" "}
                <Link
                  to="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:underline"
                >
                  politique de confidentialité
                </Link>
              </span>
            </label>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button type="submit" disabled={loading || !consentChecked}>
              {loading ? "Inscription... " : "S'inscrire"}
            </Button>
          </form>

          <p className="mt-3 text-sm text-zinc-100 text-center">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-amber-600 hover:underline">
              Connectez-vous ici
            </Link>
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
