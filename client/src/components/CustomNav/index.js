import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import { FaShoppingBasket } from "react-icons/fa";
const CustomNav = ({ basketItems, isLoggedIn, username }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const loginLogout = isLoggedIn ? (
    <NavLink tag={Link} to="/logout">
      Đăng xuất
    </NavLink>
  ) : (
    <NavLink tag={Link} to="/login">
      Đăng nhập
    </NavLink>
  );

  return (
    <div className="custom-nav">
      <Navbar color="light" light expand="md" container>
        <NavbarBrand tag={Link} to="/" className="mr-auto">
          Frank-Store
        </NavbarBrand>
        <NavbarToggler onClick={toggle} className="mr-2" />
        <Collapse isOpen={isOpen} navbar>
          <Nav navbar>
            <UncontrolledDropdown nav inNavbar>
              {isLoggedIn ? (
                <>
                  <DropdownToggle nav caret>
                      Tài khoản
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem>
                      <NavLink tag={Link} to="/orders">
                        Thông tin đặt hàng
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink tag={Link} to="/profile">
                        Thông tin tài khoản
                      </NavLink>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>{loginLogout}</DropdownItem>
                  </DropdownMenu>
                </>
              ) : (
                loginLogout
              )}
            </UncontrolledDropdown>
            <NavItem>
              <NavLink tag={Link} to="/basket" className="basket-icon-wrapper">
                <span className="basket-items">{basketItems}</span>
                <FaShoppingBasket className="basket-icon" />
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNav;
