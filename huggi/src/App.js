
import ImageGenerator from './components/imagegenerator';
import './App.css';
import Disclaimer from './components/disclaimer';
import Footer from './components/footer';

function App() {
  return (
    <div className="App border border-primary bg-slate-50 w-full  px-4 py-2 rounded">
      
     <ImageGenerator  />
     <Disclaimer />
     <Footer/>
    </div>
  );
}

export default App;

