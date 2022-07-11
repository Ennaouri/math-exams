import Footer from "./Footer";
import NavbarHeader from "./NavbarHeader";

const Layout = ({children}) => {
    return ( 
        <div>
            <NavbarHeader />
            {children}
            <Footer />
        </div>
     );
}
 
export default Layout;