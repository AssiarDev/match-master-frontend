import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

export const LoginModal = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mail = e.target[0].value
    const password = e.target[1].value

    login(mail, password, () => setOpen(false))
  };

  const hasError = Boolean(error)

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-neutral-950/75 transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-neutral-950 border-none shadow-lg shadow-amber-900/50 rounded-lg w-96 p-6">
          <button
            onClick={() => {
              setOpen(false)
              navigate('/')
            }}
            aria-label="Fermer le modal"
            className="absolute top-2 right-2 text-white hover:text-red-500 text-2xl cursor-pointer"
          >
            ×
          </button>

          <DialogTitle className="text-xl font-bold text-white">Connexion</DialogTitle>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              className={`border p-2 rounded focus:ring bg-neutral-900 text-white ${
                hasError ? "border-red-500 focus:border-red-500" : "focus:border-amber-500"
              }`}

            />
            <input
              type="password"
              required
              placeholder="Mot de passe"
              className={`border p-2 rounded focus:ring bg-neutral-900 text-white ${
                hasError ? "border-red-500 focus:border-red-500" : "focus:border-amber-500"
              }`}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 text-neutral-950 py-2 rounded hover:bg-amber-700 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-3 text-sm text-white text-center">
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