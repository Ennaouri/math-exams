import React, { useRef } from 'react';
import { Breadcrumb, BreadcrumbItem,
    Button, Col, Card, Form, FormGroup, Label, Input } from 'reactstrap';
/* import { Control, Errors, LocalForm} from 'react-redux-form'; */
import Link from 'next/link';
import * as emailjs from "@emailjs/browser"
import Style from '../styles/contact.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarker, faPhone } from '@fortawesome/free-solid-svg-icons';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);




const contactus = () => {
    const form = useRef();
/*     const sendEmail = (values) => {
    
        emailjs.sendForm('service_g587ta8', 'template_3iycr0n', document.getElementById('feedback'), 'user_LPf1XOqxV7t8iSDE0qi1n')
          .then((result) => {        
              document.getElementById("feedback").reset();
              console.log("result is ", result)
              alert('Your mail is sent!');
          }, (error) => {
              alert(error.text)
          });
          
      } */
      const sendEmail = (e) => {
        e.preventDefault();
    
        emailjs.sendForm('service_g587ta8', 'template_3iycr0n', form.current, 'user_LPf1XOqxV7t8iSDE0qi1n')
          .then((result) => {
              console.log(result.text);
              alert('Your mail is sent!');
          }, (error) => {
              console.log(error.text);
          });
      };

    return ( 
    <>
    <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link href="/">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Contact Us</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3 className={Style.header3}>Contact
                            <span style={{color: '#ff4c3b'}}> US</span>
                        </h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6 row ml-auto" >
                        <Card className={`col-md-5 col-sm-12 m-2 ` + Style.styledcard} >
                        <FontAwesomeIcon icon={faMapMarker} style={{padding: "8px" , color : '#ff4c3b'}} size="2xl"/><br />
                        <p className={Style.paragraphe}>Rue Arrahma, Rabat Center agdal </p>
                        </Card>
                        <Card className={`col-md-5 col-sm-12 m-2 ` + Style.styledcard} >
                        <FontAwesomeIcon icon={faEnvelope} style={{padding: "8px" , color : '#ff4c3b'}} size="2xl"/><br />
                        <p className={Style.paragraphe}>contact@lowcostshop.com</p>
                        <p className={Style.paragraphe}>test.lowdiscovery1@gmail.com</p>
                        </Card>
                        <Card className={`col-md-5 col-sm-12 m-2 ` + Style.styledcard} >
                        <FontAwesomeIcon icon={faPhone} style={{padding: "8px" , color : '#ff4c3b'}} size="2xl"/><br />
                        <p className={Style.paragraphe}>+212 649430452</p>
                        </Card>
                        <Card className={`col-md-5 col-sm-12 m-2 ` + Style.styledcard} >
                        <i className="fa fa-whatsapp fa-4x" style={{color : '#ff4c3b'}}></i><br />
                        <p className={Style.paragraphe}>whatsapp: +212 634842943</p>
                        </Card>
                    </div>
                        <div className="col-sm-12 col-md-6">
                        <form ref={form} onSubmit={sendEmail}>
                        <FormGroup className="form-group mb-4">
                                    <Label for="firstname" md={2}>First Name</Label>
                                    
                                        <Input type="text" name="to_name"
                                            placeholder="First Name"
                                            className="form-control"
                                            /* validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15)
                                            }} */
                                             />
                                        {/* <Errors
                                            className="text-danger"
                                            model=".firstname"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                         /> */}
                                    
                                </FormGroup>
                                <FormGroup className="form-group mb-4">
                                    <Label for="lastname" md={2}>Last Name</Label>
                                        <Input type="text"  name="to_last_name"
                                            placeholder="Last Name"
                                            className="form-control"
                                            /* validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15)
                                            }} */
                                             />
                                        {/* <Errors
                                            className="text-danger"
                                            model=".lastname"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                         /> */}
                                </FormGroup>
                                <FormGroup className="form-group mb-4">
                                    <Label for="telnum" md={2}>Contact Tel.</Label>
                                        <Input type="text" name="telnum"
                                            placeholder="Tel. Number"
                                            className="form-control"
                                            /* validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15), isNumber
                                            }} */
                                             />
                                       {/*  <Errors
                                            className="text-danger"
                                            model=".telnum"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 numbers',
                                                maxLength: 'Must be 15 numbers or less',
                                                isNumber: 'Must be a number'
                                            }}
                                         /> */}
                                </FormGroup>
                                <FormGroup className="form-group mb-4">
                                    <Label for="email" md={2}>Email</Label>
                                        <Input type="email"  name="user_email"
                                            placeholder="Email"
                                            className="form-control"
                                            /* validators={{
                                                required, validEmail
                                            }} */
                                             />
                                       {/*  <Errors
                                            className="text-danger"
                                            model=".email"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                validEmail: 'Invalid Email Address'
                                            }}
                                         /> */}
                                </FormGroup>
                                <FormGroup className="form-group mb-4">
                                        <div className="form-check">
                                            <Label check>
                                                <Input type="radio" model=".agree" name="agree"
                                                    className="form-check-input"
                                                     />
                                                    <strong>May we contact you?</strong>
                                            </Label>
                                        </div>
                                        <Input type="select" model=".contactType" name="contactType"
                                            className="form-control">
                                            <option>Tel.</option>
                                            <option>Email</option>
                                        </Input>
                                </FormGroup>
                                <FormGroup className="form-group mb-4">
                                    <Label for="message" >Your Feedback</Label>
                                        <Input type="textarea"  name="message"
                                            
                                            className="form-control" />
                                </FormGroup>
                                <FormGroup className="form-group mb-4">
                                        <Input type="submit" color="bg-primary" value="Send Feedback" />
                                        
                                </FormGroup>
    </form>
                    </div>
                    <div className="row mt-5">
                    <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.781500064089!2d-6.87256278483017!3d33.99814568062065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76cfbaeed110f%3A0x118460c608843ba3!2sKissariat%20Oued%20Eddahab!5e0!3m2!1sfr!2sma!4v1657557359922!5m2!1sfr!2sma"
                     width="600" height="450" style={{border:"0"}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
            </> );
}
 
export default contactus;