import './App.css';
import Header from './layout/header/header';
import Footer from './layout/footer/footer';
import Home from './pages/home/home';

function App() {
  return (
    <div className="App">
    <Header/>
    <Home/>
    <Footer/>
    </div>
  );
}

export default App;
