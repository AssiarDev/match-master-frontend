export const Footer = () => {
    return (
        <footer className="w-full bg-zinc-950 border-none border-amber-900 relative text-white text-center py-4 mt-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-gradient-to-b before:from-amber-900/50 before:to-transparent">
            <p className="text-sm">&copy; {new Date().getFullYear()} - Tous droits réservés</p>
            <p className="text-sm">Développé par Raïssa Ali</p>
        </footer>
    )
}