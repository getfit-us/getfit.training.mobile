import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar } from "react-native-paper";

const SnackBarComponent = ({ message, showSnackBar, setShowSnackBar }) => {
  const onToggleSnackBar = () => setShowSnackBar(!showSnackBar);

  const onDismissSnackBar = () => setShowSnackBar(false);

  return (
    <View style={styles.container}>
      <Snackbar
        visible={showSnackBar}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Ok",
          onPress: () => {
            // Do something
          },
        }}  
        wrapperStyle={{
           position: "absolute",
              bottom:300,            
    
        }}
   
        
      >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default SnackBarComponent;
