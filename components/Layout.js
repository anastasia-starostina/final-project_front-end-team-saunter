import Footer from "./Footer"
// import Navbar from "./Navbar"
import NavItem from "./Expnavbar";

const Layout = ({ children }) => {
  return (
    <div className="content">
      <NavItem />
      { children }
      <Footer />
    </div>
  );
}
 
export default Layout;