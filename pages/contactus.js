import React from 'react';
import { Breadcrumb, BreadcrumbItem,
    Button, Row, Col, Label, Card } from 'reactstrap';
import { Control, Errors, LocalForm} from 'react-redux-form';
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
    const sendEmail = (values) => {
    
        emailjs.sendForm('service_g587ta8', 'template_3iycr0n', document.getElementById('feedback'), 'user_LPf1XOqxV7t8iSDE0qi1n')
          .then((result) => {        
              document.getElementById("feedback").reset();
              console.log("result is ", result)
              alert('Your mail is sent!');
          }, (error) => {
              alert(error.text)
          });
          
      }

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
                        <LocalForm model="feedback" id="feedback" onSubmit={sendEmail}>
                        <Row className="form-group mb-4">
                                    <Label htmlFor="firstname" md={2}>First Name</Label>
                                    <Col md={10}>
                                        <Control.text model=".firstname" id="firstname" name="firstname"
                                            placeholder="First Name"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15)
                                            }}
                                             />
                                        <Errors
                                            className="text-danger"
                                            model=".firstname"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                         />
                                    </Col>
                                </Row>
                                <Row className="form-group mb-4">
                                    <Label htmlFor="lastname" md={2}>Last Name</Label>
                                    <Col md={10}>
                                        <Control.text model=".lastname" id="lastname" name="lastname"
                                            placeholder="Last Name"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15)
                                            }}
                                             />
                                        <Errors
                                            className="text-danger"
                                            model=".lastname"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                         />
                                    </Col>
                                </Row>
                                <Row className="form-group mb-4">
                                    <Label htmlFor="telnum" md={2}>Contact Tel.</Label>
                                    <Col md={10}>
                                        <Control.text model=".telnum" id="telnum" name="telnum"
                                            placeholder="Tel. Number"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15), isNumber
                                            }}
                                             />
                                        <Errors
                                            className="text-danger"
                                            model=".telnum"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Must be greater than 2 numbers',
                                                maxLength: 'Must be 15 numbers or less',
                                                isNumber: 'Must be a number'
                                            }}
                                         />
                                    </Col>
                                </Row>
                                <Row className="form-group mb-4">
                                    <Label htmlFor="email" md={2}>Email</Label>
                                    <Col md={10}>
                                        <Control.text model=".email" id="email" name="email"
                                            placeholder="Email"
                                            className="form-control"
                                            validators={{
                                                required, validEmail
                                            }}
                                             />
                                        <Errors
                                            className="text-danger"
                                            model=".email"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                validEmail: 'Invalid Email Address'
                                            }}
                                         />
                                    </Col>
                                </Row>
                                <Row className="form-group mb-4">
                                    <Col md={{size: 6, offset: 2}}>
                                        <div className="form-check">
                                            <Label check>
                                                <Control.checkbox model=".agree" name="agree"
                                                    className="form-check-input"
                                                     />
                                                    <strong>May we contact you?</strong>
                                            </Label>
                                        </div>
                                    </Col>
                                    <Col md={{size: 3, offset: 1}}>
                                        <Control.select model=".contactType" name="contactType"
                                            className="form-control">
                                            <option>Tel.</option>
                                            <option>Email</option>
                                        </Control.select>
                                    </Col>
                                </Row>
                                <Row className="form-group mb-4">
                                    <Label htmlFor="message" md={2}>Your Feedback</Label>
                                    <Col md={10}>
                                        <Control.textarea model=".message" id="message" name="message"
                                            rows="5"
                                            className="form-control" />
                                    </Col>
                                </Row>
                                <Row className="form-group mb-4">
                                    <Col md={{size:10, offset: 2}}>
                                        <Button type="submit" color="primary">
                                        Send Feedback
                                        </Button>
                                    </Col>
                                </Row>
                                </LocalForm>
                    </div>
                    <div className="row mt-5">
                    <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13231.051129831018!2d-6.868311594376454!3d33.998626383039834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76c89d87752c9%3A0xfa1d80a264d4ba2b!2sArribat%20Center!5e0!3m2!1sfr!2sma!4v1638036392553!5m2!1sfr!2sma" 
                    width="600" 
                    height="450" 
                    style={{border:'0'}}
                    allowFullScreen="" 
                    loading="lazy">
                    </iframe>
                    </div>
                </div>
            </div>
            </> );
}
 
export default contactus;