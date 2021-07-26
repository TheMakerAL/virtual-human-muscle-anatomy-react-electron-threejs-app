import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export class AboutModal extends React.Component {
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="about-modal"
        centered
        id="about-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            About
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>3D model credits:</strong>
          </p>

          <p> 
            <a href="https://sketchfab.com/3d-models/male-full-body-ecorche-ab11ebff89224f03bd75efede1164cf6" target="_blank">Male Full Body Ecorche</a> by <a href="https://sketchfab.com/diegoluga" target="_blank">Diego Luján García from Madrid, Spain</a><br/>
            Licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC Attribution</a>.
          </p>
          
          <p>
            <a href="https://sketchfab.com/3d-models/skull-downloadable-1a9db900738d44298b0bc59f68123393" target="_blank">Skull downloadable</a> by <a href="https://sketchfab.com/martinjario" target="_blank">martinjario from Madrid, Spain</a><br/>
            Licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC Attribution</a>.
          </p>

          <p>
            <a href="https://www.pexels.com/photo/matrix-background-1089438/" target="_blank">Matrix Background</a> by <a href="https://www.pexels.com/@markusspiske" target="_blank">Markus Spiske from Upper Franconia, Bavaria, Germany</a><br/>
            Licensed under <a href="https://www.pexels.com/license/" target="_blank">Pexels Free to Use</a>.
          </p>

          <p>
            <a href="https://www.pexels.com/photo/black-and-white-abstract-painting-7911699/" target="_blank">Black and White Abstract Painting
</a> by <a href="https://www.pexels.com/@alesiakozik" target="_blank">Alesia Kozik from Erfurt</a><br/>
            Licensed under <a href="https://www.pexels.com/license/" target="_blank">Pexels Free to Use</a>.
          </p>

          <p>      
            <strong>Visit <a href="https://www.makeral.com" target="_blank">MakerAL.com</a> for more goodies.</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
