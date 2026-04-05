import { useAuth } from "@/context/AuthContext"
import { FiUser } from "react-icons/fi"
import { Link } from "react-router"
import { useLogout } from "@/hooks/useLogout"
import { useDeleteProfile } from "@/hooks/useDeleteProfile"

const cardClass = "border border-gray-700 rounded-xl shadow-md p-4 w-full bg-zinc-900 text-white transition duration-300 hover:shadow-lg hover:border-orange-800 flex flex-col gap-4"

export const UserProfile = () => {

    const { user } = useAuth()
    const logout = useLogout()
    const deleteProfile = useDeleteProfile()

    return (
        <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
            <div className="px-2 pt-2 flex justify-between items-center w-full">
                <h1 className="text-white font-bold text-2xl sm:text-4xl">Mon profil</h1>
                <div className="text-white text-2xl sm:text-4xl flex items-center gap-2">
                    <FiUser />
                    <span>{user?.username}</span>
                </div>
            </div>
            <div className="px-2 flex flex-col gap-3">
                <h2 className="text-white text-2xl sm:text-3xl">Mes informations</h2>
                <div className={cardClass}>
                    <div className="flex justify-between">
                        <h3 className="font-bold">Username</h3>
                        <Link to='' className="text-orange-500 hover:underline">Modifier</Link>
                    </div>
                    <div className="flex justify-between">
                        <h3 className="font-bold">Mot de passe</h3>
                        <Link to='' className="text-orange-500 hover:underline">Modifier</Link>
                    </div>
                    <div className="flex justify-between">
                        <h3 className="font-bold">Date d'inscription</h3>
                        <span>{user?.createdAt}</span>
                    </div>
                </div>
            </div>
            <div className="px-2 flex flex-col gap-3">
                <h2 className="text-white text-2xl sm:text-3xl">Notification push</h2>
                <div className={cardClass}>
                    <div className="flex justify-between">
                        <h3 className="font-bold">Notification match</h3>
                        <button className="border border-gray-600 rounded-sm px-3 py-1 hover:border-orange-500 hover:text-orange-500 transition duration-200">Activer</button>
                    </div>
                </div>
            </div>
            <div className="px-2 flex flex-col gap-3">
                <h2 className="text-white text-2xl sm:text-3xl">Thème</h2>
                <div className={cardClass}>
                    <div className="flex justify-between">
                        <h3 className="font-bold">Mode clair</h3>
                        <button className="border border-gray-600 rounded-sm px-3 py-1 hover:border-orange-500 hover:text-orange-500 transition duration-200">Activer</button>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <button onClick={logout} className="border border-gray-600 rounded-sm px-4 py-2 text-white hover:border-red-500 hover:text-red-500 transition duration-200">Déconnexion</button>
            </div>
            <div className="flex justify-center">
                <button onClick={() => deleteProfile(user?.id)} className="text-red-500 hover:underline cursor-pointer">Supprimer mon compte</button>
            </div>
        </div>
    )
}
