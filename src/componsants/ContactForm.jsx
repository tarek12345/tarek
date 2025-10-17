import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactForm(tras) {
  const form = useRef();
  const recaptchaRef = useRef(null);

  const serviceID = 'service_dx1ob8i';
  const templateID = 'template_ddbjogq';
  const userID = 'YZf-kCVH11ePwsLgO';

  // Fonction pour envoyer l'email via EmailJS
  const sendEmail = (e) => {
    e.preventDefault();

    // Récupérer la réponse reCAPTCHA
    const recaptchaValue = recaptchaRef.current.getValue();
    if (!recaptchaValue) {
      // Si le reCAPTCHA n'est pas validé
      toast.error('Veuillez valider le reCAPTCHA avant de soumettre le formulaire.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      return;
    }

    // Continuer avec l'envoi si reCAPTCHA validé
    emailjs
      .sendForm(serviceID, templateID, form.current, {
        publicKey: userID,
      })
      .then(
        () => {
          // Affichage d'un toast de succès
          toast.success('Message envoyé avec succès!', {
            position: 'bottom-right',
            autoClose: 3000,
          });
          form.current.reset(); // Réinitialiser le formulaire après envoi
          recaptchaRef.current.reset(); // Réinitialiser le reCAPTCHA
        },
        (error) => {
          // Affichage d'un toast d'erreur
          toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.", {
            position: 'bottom-right',
            autoClose: 3000,
          });
          console.log('FAILED...', error.text);
        }
      );
  };

  return (
    <div className="formaulire-contact">
      {/* Formulaire de contact */}
      <form ref={form} onSubmit={sendEmail}>
        <div className="mb-3 champs">
          <input
            type="text"
            name="user_name"
            id="user_name"
            className="form-control"
            placeholder={tras.long === 'FR' ? 'Nom' : 'Name'}
            required
          />
        </div>
        <div className="mb-3 champs">
          <input
            type="email"
            name="user_email"
            id="user_email"
            className="form-control"
            placeholder={tras.long === 'FR' ? 'Email' : 'Email'}
            required
          />
        </div>
        <div className="mb-3 champs">
          <textarea
            name="message"
            id="message"
            className="form-control"
            rows="4"
            placeholder={tras.long === 'FR' ? 'Message' : 'Message'}
            required
          ></textarea>
        </div>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6Lc5ge0rAAAAAKn5DjgvURFe97ENmn4MRKnLzlu3"
        />

        <button type="submit" className="btn-hover color-7">
          {tras.long === 'FR' ? 'Envoyer' : 'Send'}
        </button>
      </form>

      {/* Composant ToastContainer pour afficher les notifications */}
      <ToastContainer />
    </div>
  );
}
