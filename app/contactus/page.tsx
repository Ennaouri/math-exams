// components/ContactForm.tsx
"use client";
import { useState } from "react";
import emailjs from "emailjs-com";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import Link from "next/link";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    telnum: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    /* <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" value={formData.message} onChange={handleChange}></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>*/
    <>
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link href="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>Contact Us</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>
              Contact
              <span style={{ color: "#ff4c3b" }}> US</span>
            </h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-6 row ml-auto">
            <Card className={`col-md-5 col-sm-12 m-2 `}>
              <p>Rue Arrahma, Rabat Center agdal </p>
            </Card>
            <Card className={`col-md-5 col-sm-12 m-2 `}>
              <p>contact@lowcostshop.com</p>
              <p>test.lowdiscovery1@gmail.com</p>
            </Card>
            <Card className={`col-md-5 col-sm-12 m-2 `}>
              <p>+212 649430452</p>
            </Card>
            <Card className={`col-md-5 col-sm-12 m-2 `}>
              <i
                className="fa fa-whatsapp fa-4x"
                style={{ color: "#ff4c3b" }}
              ></i>
              <br />
              <p>whatsapp: +212 634842943</p>
            </Card>
          </div>
          <div className="col-sm-12 col-md-6">
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="firstname" md={2}>
                  First Name
                </Label>

                <Input
                  type="text"
                  name="to_name"
                  placeholder="First Name"
                  className="form-control"
                />
              </FormGroup>
              <FormGroup>
                <Label for="lastname" md={2}>
                  Last Name
                </Label>
                <Input
                  type="text"
                  name="to_last_name"
                  placeholder="Last Name"
                  className="form-control"
                />
              </FormGroup>
              <FormGroup>
                <Label for="telnum" md={2}>
                  Contact Tel.
                </Label>
                <Input
                  type="text"
                  name="telnum"
                  placeholder="Tel. Number"
                  className="form-control"
                />
              </FormGroup>
              <FormGroup>
                <Label for="email" md={2}>
                  Email
                </Label>
                <Input
                  type="email"
                  name="user_email"
                  placeholder="Email"
                  className="form-control"
                />
              </FormGroup>
              <FormGroup>
                <div className="form-check">
                  <Label check>
                    <Input
                      type="radio"
                      model=".agree"
                      name="agree"
                      className="form-check-input"
                    />
                    <strong>May we contact you?</strong>
                  </Label>
                </div>
                <Input
                  type="select"
                  model=".contactType"
                  name="contactType"
                  className="form-control"
                >
                  <option>Tel.</option>
                  <option>Email</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="message">Your Feedback</Label>
                <Input
                  type="textarea"
                  name="message"
                  className="form-control"
                />
              </FormGroup>
              <FormGroup>
                <Input type="submit" color="bg-primary" value="Send Feedback" />
              </FormGroup>
            </form>
          </div>
          <div className="row mt-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.781500064089!2d-6.87256278483017!3d33.99814568062065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76cfbaeed110f%3A0x118460c608843ba3!2sKissariat%20Oued%20Eddahab!5e0!3m2!1sfr!2sma!4v1657557359922!5m2!1sfr!2sma"
              width="600"
              height="450"
              style={{ border: "0" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
