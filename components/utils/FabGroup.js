import * as React from 'react';
import { FAB, Portal, } from 'react-native-paper';

const FabGroup = ({handleOpen, open,visible, actions }) => {
   


  return (
      <Portal>
        <FAB.Group
          open={open}
          visible={visible}
          icon={open ? 'close' : 'plus'}
          actions={actions}
          onStateChange={handleOpen}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
  );
};

export default FabGroup;