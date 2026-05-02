"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  subject: string;
  message: string;
}

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "contact@maths-exams.com",
    href: "mailto:contact@maths-exams.com",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Adresse",
    value: "Rue Arrahma, Rabat Center Agdal, Maroc",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Téléphone",
    value: "+212 649430452",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: "WhatsApp",
    value: "+212 710500405",
  },
];

const subjects = [
  "Question générale",
  "Problème technique",
  "Demande de cours",
  "Partenariat",
  "Autre",
];

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstname.trim()) newErrors.firstname = "Le prénom est requis";
    if (!formData.lastname.trim()) newErrors.lastname = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.subject) newErrors.subject = "Le sujet est requis";
    if (!formData.message.trim()) newErrors.message = "Le message est requis";
    else if (formData.message.trim().length < 10) newErrors.message = "Message trop court";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Contactez <span className="text-blue-600">Nous</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Vous avez une question ? Nous sommes là pour vous aider. N&apos;hésitez pas à nous contacter.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Informations de Contact</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm opacity-75">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="font-semibold hover:underline"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-semibold">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-sm opacity-75 mb-3">Suivez-nous</p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2.16c3.2,0,3.58,0,4.85.07,1.17.07,2.09.32,2.89.76a3.9,3.9,0,0,1,2.82,2.82c.43.8.68,1.72.75,2.89.05,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.07,1.17-.32,2.09-.75,2.89a3.9,3.9,0,0,1-2.82,2.82c-.8.43-1.72.68-2.89.75-1.27.05-1.65.07-4.85.07s-3.58,0-4.85-.07c-1.17-.07-2.09-.32-2.89-.75a3.9,3.9,0,0,1-2.82-2.82C2.33,16.93,2.08,16,2,14.85,2.05,13.58,2,13.2,2,10s0-3.58.07-4.85c.07-1.17.32-2.09.75-2.89a3.9,3.9,0,0,1,2.82-2.82c.8-.43,1.72-.68,2.89-.75C8.42,2.16,8.8,2.16,12,2.16M12,0C8.74,0,8.33,0,7.05.07,5.78.14,4.89.33,4.14.72a5.07,5.07,0,0,0-1.77,1.77C1.91,3.72.92,4.6.85,5.47.78,6.75.59,7.64.59,9c0,6,0,6.53,0,9.85c0,1.27.14,2.16.53,2.91a5.07,5.07,0,0,0,1.77,1.77c.75.39,1.64.53,2.91.53H12c6,0,6.53,0,9.85,0,1.27,0,2.16-.14,2.91-.53a5.07,5.07,0,0,0,1.77-1.77c.39-.75.53-1.64.53-2.91,0-1.27,0-2.16-.07-3.93,0,.77,0-1.66-.07-2.93,0-1.27.14-2.16.53-2.91a5.07,5.07,0,0,0-1.77-1.77C17.18.33,16.29.14,15,.07,13.67,0,13.19,0,12,0Z" />
                    <path d="M12,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84M12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.6,6.3c-.3-1-1-1.8-2.1-2.1C19.3,3.5,12,3.5,12,3.5s-7.3,0-9.5.7c-1.1.2-1.8,1-2.1,2.1C0,8.7,0,12,0,12s0,7.3.7,9.5c.2,1.1,1,1.8,2.1,2.1,2.2.7,9.5.7,9.5.7s7.3,0,9.5-.7c1.1-.2,1.8-1,2.1-2.1.7-2.2.7-5.7.7-5.7s0-7.3-.7-9.5ZM9.6,15.6V8.4L15.8,12Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {status === "success" ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Message Envoyé !
                </h3>
                <p className="text-gray-600 mb-6">
                  Merci de nous avoir contactés. Nous répondrons dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstname"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.firstname
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2 transition-colors`}
                      placeholder="Votre prénom"
                    />
                    {errors.firstname && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.lastname
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2 transition-colors`}
                      placeholder="Votre nom"
                    />
                    {errors.lastname && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    } focus:outline-none focus:ring-2 transition-colors`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.subject
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    } focus:outline-none focus:ring-2 transition-colors bg-white`}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    {subjects.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.message
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    } focus:outline-none focus:ring-2 transition-colors resize-none`}
                    placeholder="Décrivez votre demande en détail..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Envoyer le Message
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="text-red-500 text-center">
                    Une erreur est survenue. Veuillez réessayer.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Questions Fréquentes
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Comment accéder aux corrigés ?
            </h3>
            <p className="text-gray-600">
              Tous nos corrigés sont accessibles gratuitement. Parcourez les catégories
              ou utilisez la barre de recherche pour trouver le sujet souhaité.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Puis-je demander un exercice spécifique ?
            </h3>
            <p className="text-gray-600">
              Oui ! Utilisez le formulaire de contact pour nous envoyer un exercice
              spécifique et notre équipe le corrigera pour vous.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">
              Les ressources sont-elles gratuites ?
            </h3>
            <p className="text-gray-600">
              Oui, toutes nos ressources éducatives sont entièrement gratuites.
              Nous croyons en l&apos;égalité des chances dans l&apos;éducation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}