import React from 'react'
import { Menu, Button, Divider } from 'react-native-paper'

const ExerciseMenu = ({ closeMenu, visible, menuAnchor, exercise}) => {
    
 


  return (
    <Menu 
        
        visible={visible}
        onDismiss={closeMenu}
        anchor={menuAnchor}>
        <Menu.Item onPress={() => {}} title="Create Note" />
        <Menu.Item onPress={() => {}} title="Item 2" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Item 3" />
    </Menu>
    
  )
}

export default ExerciseMenu