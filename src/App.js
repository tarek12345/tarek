import './App.css';
import Home from './pages/home/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Helmet } from 'react-helmet';
function App() {
  return (
    <div className="App">
       <Helmet>
         <title>Tarek Ben Arfa | Développeur Front-End React JS, Angular, Next.js</title>
       <meta 
name="description" 
content="Portfolio de Tarek Ben Arfa, développeur Front-End spécialisé React JS, Angular, Next.js, WordPress et développement web moderne."
/>

<meta 
name="keywords" 
content="Tarek Ben Arfa, développeur React JS, Angular, Next.js, Front-End Developer Tunisie, Portfolio développeur"
/>
      </Helmet>
    <Home/>
    </div>
  );
}

export default App;
