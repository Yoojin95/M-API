import MainNav from "./MainNav";
import { Container } from "react-bootstrap";

const Layout = (props) => {
  return (
    <>
      <MainNav />
      <Container>{props.children}</Container>
      <br />
    </>
  );
};

export default Layout;
