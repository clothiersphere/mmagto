import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

const FighterStatsLoadingModal = () => (
  <Modal trigger={<Button>Basica Modal</Button>} basic size="small">
    <Header icon="archive" content="Archive Old Messages" />
    <Modal.Content>
      <p> Querying Fighter Stats </p>
    </Modal.Content>
    <Modal.Actions>
      <Button basic color="red" inverted>
        <Icon name="remove" /> No
      </Button>
      <Button color="green" inverted>
        <Icon name="checkmark" /> Yes
      </Button>
    </Modal.Actions>
  </Modal>
);

export default FighterStatsLoadingModal;
