import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FormEvent, useState } from "react";
import { useUpdateInfoUser } from "@/hooks/useUpdateInfoUser";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/UI/Button/Button";
import { Input } from "@/components/UI/Input/Input";

/** Modal dialog to change the authenticated user's password. Calls `onSuccess` with a confirmation message on success. */
export const EditPasswordModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (message: string) => void;
}) => {
  const [open, setOpen] = useState(true);
  const { error, updateUser, loading } = useUpdateInfoUser();
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const currentPassword = (form[0] as HTMLInputElement).value;
    const newPassword = (form[1] as HTMLInputElement).value;
    const confirmPassword = (form[2] as HTMLInputElement).value;
    const success = await updateUser(
      user!.id,
      undefined,
      currentPassword,
      newPassword,
      confirmPassword,
    );
    if (success) {
      onClose();
      onSuccess("Mot de passe mis à jour avec succès");
    }
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
            className="absolute top-2 right-2 text-zinc-100 hover:text-red-500 text-2xl cursor-pointer"
          >
            ×
          </button>

          <DialogTitle className="text-xl font-bold text-zinc-100">
            Modifier votre mot de passe
          </DialogTitle>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col space-y-3"
          >
            <Input
              type="password"
              required
              placeholder="Mot de passe actuel"
              error={hasError}
            />
            <Input
              type="password"
              required
              placeholder="Nouveau mot de passe"
              error={hasError}
            />
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• 8 caractères minimum</li>
              <li>• 1 majuscule requise</li>
              <li>• 1 caractère spécial requis</li>
            </ul>
            <Input
              type="password"
              required
              placeholder="Confirmer votre mot de passe"
              error={hasError}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" disabled={loading}>
              Modifier
            </Button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
