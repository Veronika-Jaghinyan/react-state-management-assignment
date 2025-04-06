import Footer from '../components/organizm/Footer';
import Header from '../components/organizm/Header';

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
