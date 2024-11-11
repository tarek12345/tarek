import './App.css';
import Home from './pages/home/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Helmet } from 'react-helmet';
function App() {
  return (
    <div className="App">
       <Helmet>
        <title>Mon Portfolio</title>
        <meta name="description" content="Portfolio où je présente mes projets et compétences." />
      </Helmet>
    <Home/>
    </div>
  );
}

export default App;
