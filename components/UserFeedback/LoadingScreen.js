import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { ActivityIndicator, IconButton } from 'react-native-paper'
import { colors } from '../../Store/colors'

export default function LoadingScreen({title, icon}) {
  return (
    <View>
      
      <IconButton icon={icon} color={colors.primary} size={100} 
      style={{margin: 30, alignSelf: 'center'}}/>
      
      <Text style={styles.title}>{title}</Text>
      <ActivityIndicator 
        animating={true}
        color={colors.primaryLight}
        size="large"
        style={{marginTop: 20}}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightgrey,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center",
        margin: 30,
    },

})