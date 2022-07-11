import React from 'react';
import {
  Collapse,
  NavbarToggler,
  Navbar,
  Nav,
  NavItem,
  NavLink,UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem,
NavbarBrand} from 'reactstrap';

  import { useState } from "react";
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
        <NavItem>
          <NavLink href="/contactus/" className="text-light bold fs-5">Contact Us</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/posts/exercice-resolver/" className="text-light bold fs-5"> Poster Vos Exercices</NavLink>
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
              1ere Année Bac
            </DropdownItem>
            <DropdownItem>
              2eme Année Bac
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              Olympiade
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Collapse>
  </Navbar>
  <hr />
</div>
   );
}
 
export default NavbarHeader;