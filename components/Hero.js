import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Style from "./../styles/Hero.module.css"
import { faFacebookSquare, faGooglePlusSquare, faInstagramSquare, faTwitterSquare, faYoutubeSquare } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import Typical from 'react-typical'

const Hero = () => {
    return ( 
      <div className="container mb-4" style={{fontWeight : "bold"}}>
        <div className="row align-items-center">
            <div className="col-md-8 text-center ">
        <div className={`mb-3 ` +Style.colz}>
              <a href="https://www.facebook.com/simohammed.nouri"><FontAwesomeIcon icon={faFacebookSquare} style={{padding: "8px", width: '50px'}}/></a>
              <a href="https://www.youtube.com/channel/UCyWGt2jLbZz4IKjlYjmBasw"><FontAwesomeIcon icon={faYoutubeSquare} style={{padding: "8px",width: '50px'}}/></a>
              <a href="https://twitter.com/EnnaouriMohamm3"><FontAwesomeIcon icon={faTwitterSquare} style={{padding: "8px", width: '50px'}} /></a>
              <a href="https://www.instagram.com/simohammednouri/?hl=fr"><FontAwesomeIcon icon={faInstagramSquare} style={{padding: "8px", width: '50px'}}/></a>
              <a href="#"><FontAwesomeIcon icon={faGooglePlusSquare} style={{padding: "8px", width: '50px'}}/></a>
        </div>
        <div className="mb-3">
        <h1 className={Style.h1}>Examens Mathématiques Du Secondaire</h1>
            <span className={Style.textprimary}>
                Je suis <span className={Style.highlighted}>ENNAOURI MOHAMMED</span>
            </span>
        </div>
        <div className={Style.profiledetailsrole}>
        <h2>
                                <Typical
                                loop={Infinity}
                                steps={[
                                    "Professeur de Mathématiques ",
                                    2000,
                                    "Astuces et exercices",
                                    2000,
                                    
                                ]}
                                />
                            </h2>
        </div>
        <div className={`mb-3 ` +Style.options}>
                        <Link href="/posts/exercice-resolver/">
                        <button className={Style.primarybtn}>
                            Poster Un Exercice
                        </button>
                        </Link>
                        <Link href="/contactus/">
                            <button className={Style.highlightedbtn}>Contactez Nous</button>
                        </Link>
        </div>
        </div>
        
        <div className={`col-md ` + Style.picture}>
            <div className={Style.picturebackground}></div>    
        </div> {/* for picture */}
        </div>
      </div>
     );
}
 
export default Hero;