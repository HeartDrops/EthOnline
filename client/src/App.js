import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import AuctionsPage from './pages/AuctionsPage';
import Footer from './components/Footer';
import Header from './components/Header';

const App = props => {
  return (
    <>
      <Header />
      <Router>    
        <Route exact path="/" component={FrontPage} />
        <Route path="/auctions" component={AuctionsPage} />
      </Router>
      <Footer />
    </>
  );
}
export default App;