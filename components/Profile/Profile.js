import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useProfile } from '../../Store/Store';
import { Card } from 'react-native-paper';
const Profile = () => {
  const profile = useProfile((state) => state.profile);
  const setProfile = useProfile((state) => state.setProfile);
  const measurements = useProfile((state) => state.measurements);
  const [currentWeight, setCurrentWeight] = React.useState(0);

  React.useEffect(() => {

  if (measurements.length !== 0) {
    setCurrentWeight(measurements[0].weight);
  }

  }, [measurements]);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>

      <Text>First Name: {profile.fistName}</Text>
        <Text>Last Name: {profile.lastName}</Text>
        <Text>Email: {profile.email}</Text>
        <Text>Phone: {profile.phone}</Text>
        <Text>Age: {profile.age}</Text>
        <Text>Current Weight: {currentWeight}</Text>          
      </Card>
        

    </View>
    
   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  card: {
    margin: 10,
    padding: 10,
  },
})


export default Profile