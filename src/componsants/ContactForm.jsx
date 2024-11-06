import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactForm() {
  const form = useRef();
  const serviceID = 'service_dx1ob8i';
  const templateID = 'template_ddbjogq';
  const userID = 'YZf-kCVH11ePwsLgO';

  // Fonction pour envoyer l'email via EmailJS
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(serviceID, templateID, form.current, {
        publicKey: userID,
      })
      .then(
        () => {
          // Affichage d'un toast de succès
          toast.success('Message envoyé avec succès!', {
            position: 'bottom-right',  // Spécifiez directement la position en chaîne de caractères
            autoClose: 3000, // Ferme après 3 secondes
          });
          form.current.reset(); // Réinitialiser le formulaire après envoi
        },
        (error) => {
          // Affichage d'un toast d'erreur
          toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.', {
            position: 'bottom-right',  // Spécifiez directement la position en chaîne de caractères
            autoClose: 3000, // Ferme après 3 secondes
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
             placeholder='Nom'
            required
          />
        </div>
        <div className="mb-3 champs">
          <input
            type="email"
            name="user_email"
            id="user_email"
            className="form-control"
            placeholder='Email'
            required
          />
        </div>
        <div className="mb-3 champs">
          <textarea
            name="message"
            id="message"
            className="form-control"
            rows="4"
             placeholder='Message'
            required
          ></textarea>
        </div>
        <button type="submit" className="btn-hover color-7">Envoyer</button>
      </form>

      {/* Composant ToastContainer pour afficher les notifications */}
      <ToastContainer />
    </div>
  );
}
