/**
 * MakerAL.com 2021
 **/

// Import React stuff
import React from 'react';
import { HashRouter } from 'react-router-dom';

// Import components
import { Page } from './components/base/Page';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';

// Import styles and assets
import './scss/app.scss';

class App extends Page {
  constructor(props) {
    super(props);

    console.log(process.env.NODE_ENV);

    // Database loadion statuses
    this.loadStatuses = {
      LOADING: "loading",
      FAILED: "failed",
      LOADED: "loaded"
    };

    // Initial states
    this.state = {
      loadStatus: this.loadStatuses.LOADING
    };
  }

  setStatus(status) {
    this.setState({
      loadStatus: status
    });
  }

  componentDidMount() {
    try {
      let loaded = true;
      if (loaded) {
        // Add delay for UX
        setTimeout(() => {
          // Update db status
          this.setStatus(this.loadStatuses.LOADED);

          // Change color <body>
          document.body.classList.add("body-no-gradient");
        }, 1000);
      } else {
        // Add delay for UX
        setTimeout(() => {
          // Update db status
          this.setStatus(this.loadStatuses.FAILED);
        }, 1000);
      }
    } catch (exception) {
      // Add delay for UX
      setTimeout(() => {
        // Update db status
        this.setStatus(this.loadStatuses.FAILED);
      }, 2000);
    }
  }


  render() {
    const loadStatus = this.state.loadStatus;

    if (loadStatus === this.loadStatuses.LOADING) {
      return (
        <div className={loadStatus}>
          <i className="fas fa-spin fa-sync" />
        </div>
      );
    } else if (loadStatus === this.loadStatuses.FAILED) {
      return (
        <div className={loadStatus}>
          <i className="fas fa-exclamation-triangle" /> Unable to load,
          <br />
          close the application and try again.
        </div>
      );
    } else if (loadStatus === this.loadStatuses.LOADED) {
      return (
        <HashRouter>
          <Header />
          <Main />
          <Footer />
        </HashRouter>
      );
    }
  }
}

export default App;
