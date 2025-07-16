import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useNavigate } from "react-router";
import { useFavorite } from "../../hooks/useFavorite";

export const FavoriteModal = () => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const { favorite, error } = useFavorite();

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
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
                    x
                </button>

                <DialogTitle className="text-xl font-bold text-white mb-5">Mes favoris</DialogTitle>

                <div>
                    {favorite.map((fav, index) => {
                        return (
                            <div key={index} className="flex items-center gap-2 border-white border-b ">
                                <img src={fav.emblem} alt={fav.name} className="mb-2 h-10 w-10"/>
                                <p className="mb-2 text-white">{fav.name}</p>
                            </div>
                        )
                    })}
                </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}