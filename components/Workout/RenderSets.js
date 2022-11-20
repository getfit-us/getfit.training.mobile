import React from 'react'
import { View , StyleSheet} from 'react-native'
import { TextInput } from 'react-native-paper'
import RenderSuperSet from './RenderSuperSet'

const RenderSets = ({sets}) => {
  return (
   
    sets?.map((set, index) => (
        Array.isArray(set) ? ( <RenderSuperSet sets={set} key={index} />) : (
        <View style={styles.sets}>
        <TextInput
       key={index + 'set'}
        label="Set"
        value={index + 1}
        editable={false}
        mode="outlined"
        style={styles.set}
    />
        <TextInput
            key={index + 'weight'}
            label="Weight"
            value={set.weight}
            mode="outlined"
            style={styles.weight}
        />
         <TextInput
            key={index + 'reps'}
            label="Reps"
            value={set.reps}
            mode="outlined"
            style={styles.rep}
        />
        </View>

    )
    ))

   

  )
}

const styles = StyleSheet.create({
    sets: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
       
        
        flex: 1,
    }   ,
    weight: {
        width: '50%',
        marginLeft: 3,
        marginRight: 3,
    },
    set: {
        width: '20%',

    },
    rep: {
        width: '30%',
    }

})

export default RenderSets