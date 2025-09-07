import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ExplorarCategorias from "./sections/ExplorarCategoriasSection/ExplorarCategoriasSection";
import HeroSection from "./sections/HeroSection.jsx/HeroSection";
import NuestrosLibrosSection from "./sections/NuestrosLibrosSection/NuestraBibliotecaSection";

function App() {
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <NuestrosLibrosSection/>
      <ExplorarCategorias/>
    </>
  );
}

export default App;
