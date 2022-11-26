import * as React from 'react';
import { ProgressBar } from 'react-native-paper';

const MyComponent = ({loading, color}) => (
  <ProgressBar indeterminate visible={loading ? loading : false} color={color ? color : 'rgb(8, 97, 164)'} />
);

export default MyComponent;