import "./App.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import ComenzaTuAventuraSection from "./sections/ComenzaTuAventura/ComenzaTuAventuraSection";
import ContactoSection from "./sections/ContactoSection/ContactoSection";
import ExplorarCategorias from "./sections/ExplorarCategoriasSection/ExplorarCategoriasSection";
import HeroSection from "./sections/HeroSection.jsx/HeroSection";
import HerramientasDocentesSection from "./sections/HerramientasDocentesSection/HerramientasDocentesSection";
import NuestrosLibrosSection from "./sections/NuestrosLibrosSection/NuestraBibliotecaSection";
import PorqueLectanaSection from "./sections/PorqueLectanaSection/PorqueLectanaSection";

function App() {
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <NuestrosLibrosSection/>
      <ExplorarCategorias/>
      <HerramientasDocentesSection/>
      <PorqueLectanaSection/>
     <ComenzaTuAventuraSection/> 
     <ContactoSection/>
     <Footer/>
    </>
  );
}

export default App;
