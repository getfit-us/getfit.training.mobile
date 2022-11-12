import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const NoNotifications = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>No Notifications</Text>
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,

    }
})


export default NoNotifications