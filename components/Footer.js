import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faGooglePlusSquare, faInstagramSquare, faTwitterSquare, faYoutubeSquare } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return ( 
        <div className="footer" style={{fontWeight : "bold",marginTop: "50px"}}>
            <hr />
        <div className="container">
            <div className="row justify-content-center">             
                <div className="col-4 offset-1 col-sm-2">
                    <h5>Links</h5>
                    <ul className="list-unstyled">
                        <li><Link href='/'>Home</Link></li>
                        <li><Link href='/contactus/'>About Us</Link></li>
                        <li><Link href='/posts/exercice-resolver/'>Exercice Resolver</Link></li>
                        <li><Link href='category/examens-du-bac/'>Examens 2eme Bac</Link></li>
                    </ul>
                </div>
                <div className="col-7 col-sm-5">
                    <h5>Our Address</h5>
                    <address>
		              CYM yaakoub el mansour<br />
		              Rabat<br />
		              Maroc<br />
		              <i className="fa fa-phone fa-lg"></i>: +212649430452<br />
		              <i className="fa fa-fax fa-lg"></i>: +212649430452<br />
		              <i className="fa fa-envelope fa-lg"></i>: <a href="mailto:lowdiscoverychannel@gmail.com">
                      lowdiscoverychannel@gmail.com</a>
                    </address>
                </div>
                <div className="col-12 col-sm-4 align-self-center">
                    <div className="text-center colz">
                        <a className="btn btn-social-icon btn-google" href="http://google.com/+"><FontAwesomeIcon icon={faGooglePlusSquare} style={{padding: "8px", width: '50px'}}/></a>
                        <a className="btn btn-social-icon btn-facebook" href="https://www.facebook.com/simohammed.nouri="><FontAwesomeIcon icon={faFacebookSquare} style={{padding: "8px", width: '50px'}}/></a>
                        <a className="btn btn-social-icon btn-linkedin" href="http://www.linkedin.com/in/"><FontAwesomeIcon icon={faInstagramSquare} style={{padding: "8px", width: '50px'}}/></a>
                        <a className="btn btn-social-icon btn-twitter" href="http://twitter.com/"><FontAwesomeIcon icon={faTwitterSquare} style={{padding: "8px", width: '50px'}} size="lg"/></a>
                        <a className="btn btn-social-icon btn-google" href="https://www.youtube.com/channel/UClHoF1987YkP3UMjMxVI01g"><FontAwesomeIcon icon={faYoutubeSquare} style={{padding: "8px", width: '50px'}}/></a>
                        <a className="btn btn-social-icon" href="mailto:"><i className="fa fa-envelope-o"></i></a>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">             
                <div className="col-auto">
                    <p>© Copyright 2022 LowDiscovery</p>
                </div>
            </div>
        </div>
    </div>
     );
}
 
export default Footer;