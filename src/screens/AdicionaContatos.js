import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Caption, TextInput, FAB, Button, HelperText, ProgressBar, Snackbar, withTheme } from 'react-native-paper'
import Header from '../components/Header'
import { BACKEND } from '../constants'

import * as DocumentPicker from 'expo-document-picker'
function AdicionaContatos({ navigation, route, theme }) {
  const { colors } = theme
  //obtendo os dados da alteração via rota
  const { data } = route.params
  const [nome, setNome] = useState(data.nome)
  const [sobrenome, setSobreNome] = useState(data.sobrenome)
  const [numero, setNumero] = useState(data.numero)
  const [email, setEmail] = useState(data.email)
  const [foto, setFoto] = useState(data.foto)
  const [erros, setErros] = useState({})
  const [salvandoContato, setSalvandoContato] = useState(false)
  

  async function salvaContato() {
    const novosErros = validaErrosContato()
    // Existe algum erro no array?
    if (Object.keys(novosErros).length > 0) {
      // Sim, temos erros!
      setErros(novosErros)
    } else {
      //Verificamos se o registro possui _id. Se não tiver, inserimos via POST, senão alteramos via PUT
      const metodo = data._id === null ? 'POST' : 'PUT'
      let contato = { nome: nome, 
        SobreNome: sobrenome,
        email: email,
        numero: numero,
         foto: foto, 
         _id:
          data._id }
      setSalvandoContato(true)
      let url = `${BACKEND}/v1/contato`
      await fetch(url, {
        mode: 'cors',
        method: metodo,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contato)
      }).then(response => response.json())
        .then(data => {
          (data._id || data.message) ? setAviso('Contato salvo com sucesso!') : setAviso('')
          setNome('')
          setFoto(fotoVazia)
          //navigation.goBack()
        })
        .catch(function (error) {
          setAviso('Não foi possível salvar o contato')
          console.error('Houve um problema ao salvar o contato: ' + error.message);
        })
      setSalvandoContato(false)
    }
  }

  const validaErrosContato = () => {
    const novosErros = {}
    // Validação do nome
    if (!nome || nome === '') novosErros.nome = 'O nome não pode ser vazio!'
    //else if (nome.length > 60) novosErros.nome = 'O nome informado é muito longo!'
    else if (nome.length < 3) novosErros.nome = 'O nome informado é muito curto!'
    // Validação do ícone
    //if (foto.mimetype !== 'image/png') novosErros.foto = 'O icone é obrigatório e deve ser um arquivo PNG'
    return novosErros
  }

  const obterImagem = async () => {
    const apiUrl = `${BACKEND}v1/contato`;
    const response = await DocumentPicker.getDocumentAsync({ type: "image/*" })
    if (response.type === 'success') {
      setUpload(true)
      response.type = 'image/png'
      const data = new FormData();
      data.append('file', response);
      await fetch(apiUrl, {
        method: 'POST',
        body: data
      }).then(response => response.json())
        .then(data => {
          if (data.upload === true) {
            const { originalname, path, size, mimetype } = data.files[0]
            setFoto({
              originalname: originalname,
              path: path,
              size: size,
              mimetype: mimetype
            })
          }
        })
        .catch(function (error) {
          console.error('Houve um problema ao fazer o upload: ' + error.message);
        })
      setUpload(false)
    } 
  }

  return (
    <>
      <Header titulo="Cadastro de Contatos" back={true} navigation={navigation} />
      <View style={{
        flex: 1, backgroundColor: colors.background,
        paddingHorizontal: 24, paddingVertical: 8
      }}>
        <Caption style={{color: colors.text, fontSize: 20, marginBottom: 32}}>Informações do Contato</Caption>

        <TextInput
          label='Nome do contato'
          name="nome"
          value={nome}
          mode='outlined'
          onChangeText={setNome}
          error={!!erros.nome}
        />
        <HelperText type="error" visible={!!erros.nome}>
          {erros.nome}
        </HelperText>

        <TextInput
          label='Sobrenome'
          name="Sobrenome"
          value={sobrenome}
          mode='outlined'
          onChangeText={setSobreNome}
          error={!!erros.sobrenome}
        />
        <HelperText type="error" visible={!!erros.sobrenome}>
          {erros.sobrenome}
        </HelperText>
        <TextInput
          label='Número'
          name="numero"
          value={numero}
          mode='outlined'
          onChangeText={setNumero}
          error={!!erros.numero}
        />
        <HelperText type="error" visible={!!erros.numero}>
          {erros.numero}
        </HelperText>
        <TextInput
          label='Email'
          name="email"
          value={email}
          mode='outlined'
          onChangeText={setEmail}
          error={!!erros.email}
        />
        <HelperText type="error" visible={!!erros.email}>
          {erros.email}
        </HelperText>
       
       
        <FAB
          style={styles.fab}
          icon='content-save'
          label='Salvar'
          loading={salvandoContato}

          onPress={() => salvaContato()}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    height: 300,
    fontSize: 16
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0
  },
  checkbox: {
    flexDirection: 'row',
    marginBottom: 32
  },
})

export default withTheme(AdicionaContatos)

