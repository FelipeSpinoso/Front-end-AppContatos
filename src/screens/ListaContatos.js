import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, Text, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { withTheme, List, Avatar, FAB } from 'react-native-paper'
import Header from '../components/Header'
import { BACKEND } from '../constants'
import ListaContato from './ListaContato'

function ListaContatos({ navigation, theme }) {
    const { colors } = theme
    const [contatos, setContatos] = useState([])
    const [carregandoContatos, setCarregandoContatos] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        obterContatos()
    }, [])

    async function obterContatos() {
        setCarregandoContatos(true)
        let url = `${BACKEND}/v1/contato`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setContatos(data)
                //console.log('Categorias obtidas com sucesso!')
            })
            .catch(function (error) {
                console.error(`Houve um problema ao obter os contatos: ${error.message}`)
            })
        setCarregandoContatos(false)
    }

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true)
        try {
            await obterContatos()
        } catch (error) {
            console.error(error)
        }
        setRefreshing(false)
    }, [refreshing])

    return (
        <>
            <Header titulo="Contatos" back={true} navigation={navigation} />
            <View style={{
                backgroundColor: colors.surface, paddingHorizontal: 8,
                paddingVertical: 8, flex: 1
            }}>
                <List.Subheader>
                    <Avatar.Icon size={24} icon="refresh" /> Para atualizar os dados
            </List.Subheader>

                {carregandoContatos && <ActivityIndicator size="large" color={colors.primary} />}
                {contatos.length === 0 && !carregandoContatos ?
                    (
                        <View style={styles.tituloAviso}>
                            <Text style={styles.titulo}>Ainda não há nenhuma contato cadastrado.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={contatos}
                            renderItem={({ item }) => (
                                <ListaContato data={item} navigation={navigation} />
                            )}
                            keyExtractor={item => item._id.toString()}
                            refreshControl={<RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh} />
                            }
                        />
                    )
                }
                <FAB
                    style={styles.fab}
                    icon='plus'
                    label=''
                    onPress={() => navigation.navigate('AddContatos', {
                        data: {
                            _id: null,
                            nome: '',
                            SobreNome:'',
                            numero: null,
                            email: '',
                            foto: ''
                        }
                    })}
                />
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0
    },

    tituloAviso: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    titulo: {
        fontSize: 20
    }
})

export default withTheme(ListaContatos)