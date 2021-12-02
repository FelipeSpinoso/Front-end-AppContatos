import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'
import { COLORS } from '../constants'
const Tab = createBottomTabNavigator()

import Home from '../screens/Home'
import Configuracoes from '../screens/Configuracoes'
import Categorias from '../screens/ListaContatos'

/*tabBarOptions= {{
            style: {
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
              borderTopWidth: 1,
              borderTopColor: Colors.lightGrey
        }}
} */

function Tabs(){

    return(
        <Tab.Navigator 
        screenOptions={({ route, navigation }) => {
            return { tabBarLabel: navigation.isFocused() ? route.name : ''}
        }}
		tabBarOptions={{
		activeTintColor: COLORS.lightGray2,
        style: {
            paddingTop: 4,
            paddingBottom: 4,
            borderTopWidth: 1,
            borderTopColor: COLORS.lightGray
      }
	}}

        
        
        >
            <Tab.Screen name="Início" component={Home}
            options={{tabBarIcon: () => (
                    <FontAwesome5 name="home" size={24} color={COLORS.lightGray} />)
            }} />
            <Tab.Screen name="Contatos" component={Contatos}
            options={{tabBarIcon: () => (
                    <FontAwesome5 name="tags" size={24} color={COLORS.lightGray} />)
            }} />
            <Tab.Screen name="Configurações" component={Configuracoes}
            options={{tabBarIcon: () => (
                    <FontAwesome5 name="cogs" size={24} color={COLORS.lightGray} />),
                    showLabel: false
            }} />
        </Tab.Navigator>
    )
}

export default Tabs