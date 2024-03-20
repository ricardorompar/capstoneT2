import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AboutModal({showAboutModal, setShowAboutModal}) {
    const handleClose = () => setShowAboutModal(false);

    return (
        <>
            <Modal show={showAboutModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>💸 Wingy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Hello thank you for visiting Wingy and clicking on everything you can. You're seeing the result of the capstone project for the second term of the MCSBT.
                    <br></br>
                    If you have any comments, ideas, suggestions, etc. feel free to reach out to me on <a href='https://www.linkedin.com/in/ricardo-romero-paredes/'>Linkedin</a>.
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AboutModal;