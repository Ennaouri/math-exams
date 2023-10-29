import React from 'react';
import {
  Collapse,
  NavbarToggler,
  Navbar,
  Nav,
  NavItem,
  NavLink,
NavbarBrand,
UncontrolledDropdown,
DropdownToggle,
DropdownMenu,
DropdownItem} from 'reactstrap';

  import { useState } from "react";
import Link from 'next/link';
const NavbarHeader = () => {
  const [isOpenn , setIsOpenn] = useState(false)

  return (
  <div>
  <Navbar color="transparent" light expand="md">
    <NavbarBrand href="/" className="text-light bold fs-2">LowdiscoveryMaths.</NavbarBrand>
    <NavbarToggler onClick={() => setIsOpenn(!isOpenn)} className="bg-light"/>
    <Collapse isOpen={isOpenn} className=" justify-content-center" navbar>
      <Nav className="ml-auto" navbar>
        <NavItem >
          <NavLink href="/" className="text-light bold fs-5">Acceuil</NavLink>
        </NavItem>
        <NavItem >
          <NavLink href="/about" className="text-light bold fs-5">About</NavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar >
          <DropdownToggle nav caret className="text-light bold fs-5">
            Niveau
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>
              Tronc Commun
            </DropdownItem>
            <DropdownItem>
              <Link href='/category/1-bac-sciences-experimentales-details/'>1ere Année Bac</Link>
            </DropdownItem>
            <DropdownItem>
              <Link href='/category/2eme-annee-bac-sciences-details/'>2eme Année Bac</Link>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              Olympiade
            </DropdownItem>
          </DropdownMenu>
  </UncontrolledDropdown>
        <NavItem>
          <NavLink href="/contactus/" className="text-light bold fs-5">Contact Us</NavLink>
        </NavItem>



      </Nav>
    </Collapse>
  </Navbar>
  <hr />
</div>
   );
}
 
export default NavbarHeader;