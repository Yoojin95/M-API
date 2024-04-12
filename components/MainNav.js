import Link from "next/link";
import { Navbar, Nav, NavDropdown, Button, Form, FormControl } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { decodeToken, readToken, removeToken } from "@/lib/authenticate";

const MainNav = () => {
  const [searchField, setSearchField] = useState("");
  // automatically hiding expanded navbar
  const [isExpanded, setIsExpanded] = useState(false); // useState 훅을 사용하여 네비게이션 바의 확장 상태를 추적할 수 있는 상태 변수를 생성
  const [, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  const tokenPayload = decodeToken();
  const token = readToken();

  const handleSearchChange = (e) => setSearchField(e.target.value);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchField.trim()) return;
    const queryString = `title=true&q=${searchField}`;

    try {
      const updatedSearchHistory = await addToHistory(queryString);
      setSearchHistory(updatedSearchHistory);
    } catch (error) {
      console.error("Error updating search history:", error);
    }

    setIsExpanded(false);
    setSearchField("");

    router.push(`/artwork?${queryString}`);
  };

  const toggleNavbar = () => setIsExpanded(!isExpanded);

  const closeNavbar = () => setIsExpanded(false);

  const logout = () => {
    removeToken();
    setIsExpanded(false);

    router.push("/login");
  };

  const isActive = (pathname) => router.pathname === pathname;

  return (
    <>
      <Navbar bg="pink" variant="light" className="fixed-top p-3 navbar-brand-custom" expand="lg" expanded={isExpanded}>
        <div className="container">
          <Navbar.Brand className="navbar-brand-custom">Yoojin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNavbar} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link onClick={closeNavbar} active={isActive("/")}>
                  Home
                </Nav.Link>
              </Link>
              {token && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link onClick={closeNavbar} active={isActive("/search")}>
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            {token ? (
              <>
                <Form className="d-flex" onSubmit={handleSearch}>
                  <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" onChange={handleSearchChange} value={searchField} />
                  <Button type="submit" variant="danger">
                    Search
                  </Button>
                </Form>
                &nbsp;
                <Nav>
                  <NavDropdown title={<span>{tokenPayload ? tokenPayload.userName : "User Name"}</span>} id="basic-nav-dropdown" align="end">
                    <Link href="/favourites" passHref legacyBehavior>
                      <NavDropdown.Item onClick={closeNavbar}>Favourites</NavDropdown.Item>
                    </Link>
                    <Link href="/history" passHref legacyBehavior>
                      <NavDropdown.Item onClick={closeNavbar}>Search History</NavDropdown.Item>
                    </Link>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            ) : (
              <Nav>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link onClick={closeNavbar} active={isActive("/register")}>
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link onClick={closeNavbar} active={isActive("/login")}>
                    Login
                  </Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </div>
      </Navbar>
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default MainNav;
