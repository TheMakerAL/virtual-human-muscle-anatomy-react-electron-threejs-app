import React from 'react';

import Button from 'react-bootstrap/Button';
import { AboutModal } from './AboutModal';

export class AboutWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutModalShow: false
    }
  }

  setAboutModalShow(bool) {
    this.setState({
      aboutModalShow: bool
    });
  }

  render() {
    return (
      <>
        <Button
          variant="light"
          size="sm"
          onClick={() => this.setAboutModalShow(true)}>
          About
        </Button>
        <AboutModal
          show={this.state.aboutModalShow}
          onHide={() => this.setAboutModalShow(false)}
        />
      </>
    );
  }
}
