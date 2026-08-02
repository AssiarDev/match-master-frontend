import { Link } from "react-router-dom";

/** Application footer displaying the copyright year and author. */
export const Footer = () => {
  return (
    <footer className="w-full bg-zinc-950 border-none border-amber-900 relative text-white text-center py-4 mt-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-gradient-to-b before:from-amber-900/50 before:to-transparent">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} - Tous droits réservés
      </p>
      <p className="text-sm">Développé par Raïssa Ali</p>
      <p className="text-xs text-zinc-500 mt-2 max-w-lg mx-auto px-4">
        Ce projet est réalisé à but éducatif uniquement. Les données sportives
        sont fournies par{" "}
        <a
          href="https://www.sportmonks.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:underline"
        >
          Sportmonks
        </a>{" "}
        et ne sont utilisées à aucune fin commerciale.
      </p>
      <Link
        to="/privacy"
        className="text-sm text-amber-600 hover:underline mt-2 inline-block"
      >
        Politique de confidentialité
      </Link>
    </footer>
  );
};
