import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import AuctionsPage from './pages/AuctionsPage';
import ArtistPage from './pages/ArtistPage';
import Footer from './components/Footer';
import Header from './components/Header';
import './index.css';

const App = props => {
  return (
    <>
      <Header />
        <Router>    
          <Route exact path="/" component={FrontPage} />
          <Route path="/auctions" component={AuctionsPage} />
          <Route path="/create" component={ArtistPage} />
        </Router>
      <Footer />
    </>
  );
}
export default App;