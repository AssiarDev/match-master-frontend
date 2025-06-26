import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";

export const RegisterModal = () => {
  const [open, setOpen] = useState(true);
  const { register, loading, error } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target[0].value;
    const mail = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;

    register(username, mail, password, confirmPassword, () => setOpen(false))
  };

  const hasError = Boolean(error);

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
            className="absolute top-2 right-2 text-white hover:text-red-500 text-2xl cursor-pointer"
          >
            ×
          </button>

          <DialogTitle className="text-xl font-bold text-white">Inscription</DialogTitle>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-3">
            <input 
              type="text" 
              placeholder="Nom d'utilisateur" 
              className="border p-2 rounded focus:ring focus:border-amber-500 bg-neutral-900 text-white" 
            />
            <input 
              type="text" 
              placeholder="Email" 
              className="border p-2 rounded focus:ring focus:border-amber-500 bg-neutral-900 text-white" 
            />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="border p-2 rounded focus:ring focus:border-amber-500 bg-neutral-900 text-white" 
            />
            <input 
              type="password" 
              placeholder="Confirmez le mot de passe" 
              className={`border p-2 rounded focus:ring focus:border-amber-500 bg-neutral-900 text-white ${
                hasError ? "border-red-500 focus:border-red-500" : "focus:border-amber-500"
                }`} 
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="bg-amber-600 text-neutral-950 py-2 rounded hover:bg-amber-700 cursor-pointer">
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