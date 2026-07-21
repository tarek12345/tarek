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
         <meta name="robots" content="index, follow"></meta>
<meta name="description" content="Développeur Full Stack React, Next.js, Angular, Laravel et WordPress en Tunisie."/>
<link rel="canonical" href="https://tarek12345.github.io/tarek/"/>

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
