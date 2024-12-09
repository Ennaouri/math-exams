// components/ContactForm.tsx
"use client";
import { useState } from "react";
import emailjs from "emailjs-com";
import Link from "next/link";



const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    telnum: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailjs
      .send(
        "service_g587ta8",
        "template_3iycr0n",
        formData,
        "user_LPf1XOqxV7t8iSDE0qi1n"
      )
      .then(
        (response) => {
          alert("Message sent successfully!");
          setFormData({
            firstname: "",
            lastname: "",
            telnum: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          alert("Failed to send message. Please try again later.");
        }
      );
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>{" "}
          / <span className="text-gray-500">Contact Us</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Contact <span className="text-blue-600">Us</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We'd love to hear from you! Please fill out the form below to get in touch.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <div className="space-y-6">
              <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <p>Rue Arrahma, Rabat Center Agdal</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <p>Email: contact@lowcostshop.com</p>
                <p>Alt: test.lowdiscovery1@gmail.com</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <p>Phone: +212 649430452</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <p>WhatsApp: +212 634842943</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label htmlFor="telnum" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="telnum"
                name="telnum"
                value={formData.telnum}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                rows={4}
                placeholder="Enter your message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Google Map */}
        <div className="mt-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.781500064089!2d-6.87256278483017!3d33.99814568062065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76cfbaeed110f%3A0x118460c608843ba3!2sKissariat%20Oued%20Eddahab!5e0!3m2!1sfr!2sma!4v1657557359922!5m2!1sfr!2sma"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

