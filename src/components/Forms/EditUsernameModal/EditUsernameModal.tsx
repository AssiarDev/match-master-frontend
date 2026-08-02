import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FormEvent, useState } from "react";
import { useUpdateInfoUser } from "@/hooks/useUpdateInfoUser";
import { useAuth } from "@/context/AuthContext";

/** Modal dialog to change the authenticated user's username. Calls `onClose` on success. */
export const EditUsernameModal = ({ onClose }: { onClose: () => void }) => {
  const [open, setOpen] = useState(true);
  const { error, updateUser, loading } = useUpdateInfoUser();
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = (form[0] as HTMLInputElement).value;
    const success = await updateUser(user!.id, username);
    if (success) onClose();
  };

  const hasError = Boolean(error);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-zinc-950/75 transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-zinc-950 border-none shadow-lg shadow-amber-900/50 rounded-lg w-96 p-6">
          <button
            onClick={() => {
              setOpen(false);
              onClose();
            }}
            aria-label="Fermer le modal"
            className="absolute top-2 right-2 text-white hover:text-red-500 text-2xl cursor-pointer"
          >
            ×
          </button>

          <DialogTitle className="text-xl font-bold text-white">
            Modifier votre nom d'utilisateur
          </DialogTitle>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col space-y-3"
          >
            <input
              type="text"
              required
              placeholder="Username"
              className={`border p-2 rounded focus:ring bg-zinc-900 text-white ${
                hasError
                  ? "border-red-500 focus:border-red-500"
                  : "focus:border-amber-500"
              }`}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 text-zinc-950 py-2 rounded hover:bg-amber-700 cursor-pointer disabled:opacity-50"
            >
              Modifier
            </button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
