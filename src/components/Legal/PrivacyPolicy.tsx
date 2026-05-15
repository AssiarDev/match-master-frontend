export const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold text-amber-800 mb-8">Politique de confidentialité</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-3">1. Responsable du traitement</h2>
        <p className="text-gray-300 leading-relaxed">
          Match Master est développé par Raïssa Ali. Pour toute question relative à vos données
          personnelles, vous pouvez nous contacter à :{' '}
          <span className="text-amber-800">[haliba.raissa@hotmail.fr]</span>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-3">2. Données collectées</h2>
        <p className="text-gray-300 leading-relaxed mb-2">
          Lors de votre inscription, nous collectons les données suivantes :
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Nom d'utilisateur</li>
          <li>Adresse e-mail</li>
          <li>Mot de passe (stocké sous forme hachée, non lisible)</li>
          <li>Date d'inscription</li>
          <li>Équipes et compétitions ajoutées en favoris</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-3">3. Finalité du traitement</h2>
        <p className="text-gray-300 leading-relaxed mb-2">
          Vos données sont utilisées uniquement pour :
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>La gestion de votre compte utilisateur</li>
          <li>L'authentification et la sécurité de votre session</li>
          <li>La personnalisation de votre expérience (favoris)</li>
        </ul>
        <p className="text-gray-300 leading-relaxed mt-2">
          La base légale de ce traitement est votre{' '}
          <span className="text-white font-medium">consentement</span> (Art. 6.1.a du RGPD),
          donné lors de votre inscription.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-3">4. Durée de conservation</h2>
        <p className="text-gray-300 leading-relaxed">
          Vos données sont conservées tant que votre compte est actif. Lors de la suppression de
          votre compte, toutes vos données personnelles sont définitivement supprimées.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-3">5. Cookies</h2>
        <p className="text-gray-300 leading-relaxed">
          Match Master utilise un unique cookie de session, strictement nécessaire au maintien de
          votre connexion. Ce cookie est automatiquement supprimé à la déconnexion. Aucun cookie de
          suivi, de publicité ou d'analyse n'est utilisé.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-3">6. Vos droits</h2>
        <p className="text-gray-300 leading-relaxed mb-2">
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>
            <span className="text-white font-medium">Droit d'accès et de rectification</span> —
            modifiez vos informations depuis votre profil
          </li>
          <li>
            <span className="text-white font-medium">Droit à l'effacement</span> — supprimez votre
            compte depuis votre profil
          </li>
          <li>
            <span className="text-white font-medium">Droit d'opposition</span> — contactez-nous à
            l'adresse indiquée ci-dessus
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-3">7. Contact & réclamations</h2>
        <p className="text-gray-300 leading-relaxed">
          Pour exercer vos droits ou pour toute réclamation, contactez-nous à{' '}
          <span className="text-amber-800">[haliba.raissa@hotmail.fr]</span>. Vous pouvez également
          déposer une plainte auprès de la{' '}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-800 hover:underline"
          >
            CNIL
          </a>
          .
        </p>
      </section>

      <p className="text-gray-500 text-sm mt-10">Dernière mise à jour : mai 2026</p>
    </div>
  )
}
