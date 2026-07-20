import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../../hooks/useRegister";
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
      <DialogBackdrop className="fixed inset-0 bg-neutral-950/75 transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-neutral-950 border-none shadow-lg shadow-amber-900/50 rounded-lg w-96 p-6">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-white hover:text-red-500 text-2xl cursor-pointer"
          >
            ×
          </button>

          <DialogTitle className="text-xl font-bold text-white">
            Inscription
          </DialogTitle>

          <form
            onSubmit={handleSubmit}
            onInput={handleFormInput}
            className="mt-4 flex flex-col space-y-3"
          >
            <input
              type="text"
              name="username"
              required
              placeholder="Nom d'utilisateur"
              className="border p-2 rounded focus:ring focus:border-amber-500 bg-neutral-900 text-white"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="border p-2 rounded focus:ring focus:border-amber-500 bg-neutral-900 text-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              className="border p-2 rounded focus:ring focus:border-amber-500 bg-neutral-900 text-white"
            />
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• 8 caractères minimum</li>
              <li>• 1 majuscule requise</li>
              <li>• 1 chiffre requis</li>
              <li>• 1 caractère spécial requis</li>
            </ul>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmez le mot de passe"
                className={`w-full border p-2 rounded focus:ring bg-neutral-900 text-white ${
                  confirmError
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-amber-500"
                }`}
              />
              {confirmError && (
                <p className="text-red-500 text-xs mt-1">{confirmError}</p>
              )}
            </div>

            <label
              className={`flex items-start gap-2 text-sm ${
                areFieldsFilled
                  ? "text-gray-300 cursor-pointer"
                  : "text-gray-500 cursor-not-allowed"
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

            <button
              type="submit"
              disabled={loading || !consentChecked}
              className="bg-amber-600 text-neutral-950 py-2 rounded hover:bg-amber-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Inscription... " : "S'inscrire"}
            </button>
          </form>

          <p className="mt-3 text-sm text-white text-center">
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
