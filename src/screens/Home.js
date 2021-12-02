import React from 'react'
import {View, Text, Button, FlatList} from 'react-native'
import { withTheme, List } from 'react-native-paper'
import Header from '../components/Header'

function Home({navigation, theme}){
    const { colors } = theme
    const opcoes = [
        {id: 1, nome:'Contatos', descricao:'Contatos', 
        icone:'blur', menu: 'ListaContatos'},
        {id: 2, nome:'Configurações', descricao:'Configurações do Aplicativo',
        icone:'cog', menu:'Configuracoes'}
    ]

    return(
        <>
            <Header titulo="Área Administrativa" subtitulo="Agenda de Contato" back={false} />
            <View style={{backgroundColor: colors.surface, paddingHorizontal: 8,
                          paddingVertical: 16, flex: 1}}>
               <List.Subheader>Selecione uma das opções:</List.Subheader>
               <FlatList data={opcoes} renderItem={({item}) => (
                   <View style={{
                    flex: 1, justifyContent: 'center', backgroundColor: colors.background,
                    borderRadius: 20, margin: 8
                }}>
                        <List.Item
                            title={item.nome}
                            style={{backgroundColor: colors.background}}
                            titleStyle={{fontSize: 20}}
                            description={item.descricao}
                            descriptionStyle={{marginBottom: 5 }}
                            onPress={() => navigation.navigate(item.menu)}
                            left={props => <List.Icon {...props} icon={item.icone} />}
                        />
                        </View>
                )}
                keyExtractor={item => item.id.toString()}
                />
            </View>
        </>
    )
}

export default withTheme(Home)