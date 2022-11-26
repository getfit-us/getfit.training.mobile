import * as React from 'react';
import { ActivityIndicator } from 'react-native-paper';

const MyComponent = ({visible, color}) => (
  <ActivityIndicator animating={visible ? visible : false} color={color ? color : 'rgb(8, 97, 164)'} />
);

export default MyComponent;