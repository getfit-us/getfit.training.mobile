import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button, IconButton } from 'react-native-paper'

const NoNotifications = () => {
  return (
    <View style={styles.container}>
       
        <Text style={styles.title}>Nothing to see here</Text>
        <Text style={styles.subtitle}>You have no notifications</Text>
        <IconButton icon="bell-off" size={100} color="grey" />
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
      marginTop: 100,
        fontSize: 25,
        fontWeight: 'bold',
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 20,
        elevation: 8,

    },
    subtitle: {
      fontSize: 16,
      margin: 5,
    },
})


export default NoNotifications