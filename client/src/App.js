import React, { Component } from 'react';
import './app.scss';
import { Content } from 'carbon-components-react';
import TutorialHeader from './components/TutorialHeader';
import { Route, Switch } from 'react-router-dom';
import FrontPage from './content/FrontPage';
import AuctionsPage from './content/AuctionsPage';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <>
        <TutorialHeader />
        <Content>
          <Switch>
            <Route exact path="/" component={FrontPage} />
            <Route path="/repos" component={AuctionsPage} />
          </Switch>
        </Content>
        <Footer />
      </>
    );
  }
}

export default App;
