import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

export const LoginModal = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      mail: e.target[0].value,
      password: e.target[1].value,
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });
  
      const data = await response.json();
      
      if (response.ok) {
        console.log("Connexion réussie :", data);
        navigate('/favoris')
        window.location.reload();
      } else {
        console.error("Erreur :", data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  };
  

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-neutral-950/75 transition-opacity" />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-neutral-950 border-none shadow-lg shadow-amber-900/50 rounded-lg w-96 p-6">
        <button 
            onClick={() => setOpen(false)} 
            className="absolute top-2 right-2 text-white hover:text-red-500 text-2xl cursor-pointer"
          >
            ×
          </button>

            <DialogTitle className="text-xl font-bold text-white">Connexion</DialogTitle>
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-3">
                <input type="text" placeholder="Email" className="border p-2 rounded focus:ring focus:border-amber-500 bg-neutral-900 text-white"/>
                <input type="password" placeholder="Mot de passe" className="border p-2 rounded focus:ring focus:border-amber-500 bg-neutral-900 text-white"/>
                <button type="submit" className="bg-amber-600 text-neutral-950 py-2 rounded hover:bg-amber-700 cursor-pointer">
                  Se connecter
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
}