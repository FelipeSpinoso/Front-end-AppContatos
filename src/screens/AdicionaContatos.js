import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, Alert } from 'react-native'
import { Avatar, Caption, TextInput, FAB, Button, HelperText, Checkbox, ProgressBar, Snackbar, withTheme } from 'react-native-paper'
import Header from '../components/Header'
import { BACKEND } from '../constants'


function AdicionaContatos({ navigation, route, theme }) {
  const { colors } = theme
  //obtendo os dados da alteração via rota
  const { data } = route.params
  const [nome, setNome] = useState(data.nome)
  const [status, setStatus] = useState(data.status)
  const fotoVazia = { originalname: '', path: '', size: 0, mimetype: '' }
  const [foto, setFoto] = useState(data.foto)
  const [erros, setErros] = useState({})
  const [upload, setUpload] = useState(false)
  const [salvandoContato, setSalvandoContato] = useState(false)
  const [aviso, setAviso] = useState('')

  async function salvaContato() {
    const novosErros = validaErrosContato()
    // Existe algum erro no array?
    if (Object.keys(novosErros).length > 0) {
      // Sim, temos erros!
      setErros(novosErros)
    } else {
      //Verificamos se o registro possui _id. Se não tiver, inserimos via POST, senão alteramos via PUT
      const metodo = data._id === null ? 'POST' : 'PUT'
      let statusContato = (status === true || status === 'ativo') ? 'ativo' : 'inativo'
      let contato = { nome: nome, 
        SobreNome: statusContato,
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
    } else {
      Alert.alert(
        "Atenção!",
        "Nenhuma imagem foi selecionada.")
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
        <View style={styles.checkbox}>
          <Checkbox
            status={status ? 'checked' : 'unchecked'}
            onPress={() => {
              setStatus(!status);
            }}
          />
          <Text style={{ color: colors.text, marginTop: 10 }}>Ativa?</Text>
        </View>
        {upload && <ProgressBar indeterminate={true} />}
       

        <Button icon="camera" mode="contained" onPress={obterImagem} style={{marginTop: 32, padding: 8}}>
          Selecionar Imagem
        </Button>
        <HelperText type="error" visible={!!erros.foto}>
          {erros.foto}
        </HelperText>
        <FAB
          style={styles.fab}
          icon='content-save'
          label='Salvar'
          loading={salvandoContato}
          disabled={erros.length > 0 || upload}
          onPress={() => salvaContato()}
        />
        <Snackbar
          visible={aviso.length > 0}
          onDismiss={() => setAviso('')}
          action={{
            label: 'Voltar',
            onPress: () => navigation.goBack()
          }}>
          <Text>{aviso}</Text>
        </Snackbar>
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

