import { useAuth } from "@/context/AuthContext";
import { FiUser } from "react-icons/fi";
import { useLogout } from "@/hooks/useLogout";
import { useDeleteProfile } from "@/hooks/useDeleteProfile";
import { useState } from "react";
import { EditUsernameModal } from "../Forms/EditUsernameModal/EditUsernameModal";
import { EditPasswordModal } from "../Forms/EditPasswordModal/EditPasswordModal";
import { Toast } from "../Toast/Toast";
import { Card } from "../UI/Card/Card";

const cardClass = "flex flex-col gap-4";

/** User profile page: displays account info, notification/theme settings, logout, and account deletion. */
export const UserProfile = () => {
  const { user } = useAuth();
  const logout = useLogout();
  const deleteProfile = useDeleteProfile();
  const [isUsernameOpen, setIsUsernameOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSuccess = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      <div className="px-2 pt-2 flex justify-between items-center w-full">
        <h1 className="text-white font-bold text-2xl sm:text-4xl">
          Mon profil
        </h1>
        <div className="text-white text-2xl sm:text-4xl flex items-center gap-2">
          <FiUser />
          <span>{user?.username}</span>
        </div>
      </div>
      <div className="px-2 flex flex-col gap-3">
        <h2 className="text-white text-2xl sm:text-3xl">Mes informations</h2>
        <Card className={cardClass}>
          <div className="flex justify-between">
            <h3 className="font-bold">Username</h3>
            <button
              onClick={() => setIsUsernameOpen(true)}
              className="text-amber-600 hover:underline"
            >
              Modifier
            </button>
          </div>
          <div className="flex justify-between">
            <h3 className="font-bold">Mot de passe</h3>
            <button
              onClick={() => setIsPasswordOpen(true)}
              className="text-amber-600 hover:underline"
            >
              Modifier
            </button>
          </div>
          <div className="flex justify-between">
            <h3 className="font-bold">Date d'inscription</h3>
            <span>{user?.createdAt}</span>
          </div>
        </Card>
      </div>
      <div className="px-2 flex flex-col gap-3">
        <h2 className="text-white text-2xl sm:text-3xl">Notification push</h2>
        <Card className={cardClass}>
          <div className="flex justify-between">
            <h3 className="font-bold">Notification match</h3>
            <button className="border border-zinc-600 rounded-sm px-3 py-1 hover:border-amber-500 hover:text-amber-500 transition duration-200">
              Activer
            </button>
          </div>
        </Card>
      </div>
      <div className="px-2 flex flex-col gap-3">
        <h2 className="text-white text-2xl sm:text-3xl">Thème</h2>
        <Card className={cardClass}>
          <div className="flex justify-between">
            <h3 className="font-bold">Mode clair</h3>
            <button className="border border-zinc-600 rounded-sm px-3 py-1 hover:border-amber-500 hover:text-amber-500 transition duration-200">
              Activer
            </button>
          </div>
        </Card>
      </div>
      <div className="flex justify-center">
        <button
          onClick={logout}
          className="border border-zinc-600 rounded-sm px-4 py-2 text-white hover:border-red-500 hover:text-red-500 transition duration-200"
        >
          Déconnexion
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => deleteProfile(user?.id)}
          className="text-red-500 hover:underline cursor-pointer"
        >
          Supprimer mon compte
        </button>
      </div>
      {isUsernameOpen && (
        <EditUsernameModal onClose={() => setIsUsernameOpen(false)} />
      )}
      {isPasswordOpen && (
        <EditPasswordModal
          onSuccess={handleSuccess}
          onClose={() => setIsPasswordOpen(false)}
        />
      )}
      {toastMessage && <Toast message={toastMessage} show={showToast} />}
    </div>
  );
};
