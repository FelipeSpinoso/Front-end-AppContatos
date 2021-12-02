import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'react-native'



const Stack = createNativeStackNavigator();

import ListaContatos from './screens/ListaContatos'
import AdicionaContatos from './screens/AdicionaContatos'

export default function Routes(){
    return(
        <NavigationContainer> 
            <StatusBar hidden />
            <Stack.Navigator initialRouteName="Contatos" screenOptions={{headerShown: false}} >
                <Stack.Screen name="Contatos" component={ListaContatos}/>
                <Stack.Screen name="AddContatos" component={AdicionaContatos}/>

                
            </Stack.Navigator>

        </NavigationContainer>
    )
}