import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import './new.css';
import { AuthContext } from '../../contexts/Auth';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom'


export default function New(){
  const{ id } = useParams();
  const history = useHistory();

  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  const {user} = useContext(AuthContext);
  const [idCustomer, setIdCustomer] = useState(false);

  // Busca todos os clientes
  useEffect(() => {
    async function loadCustomers(){
      await firebase.firestore().collection('customers')
      .get()
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia,
          })
        })

        if(lista.length === 0){
          setCustomers([ {
            id: 1,
            nomeFantasia: 'Freela'
          }])
          setLoadCustomers(false);
          return;
        }
        setCustomers(lista);
        setLoadCustomers(false);

        if(id) {
          loadId(lista)
        }
      })
      .catch((error) => {
        setLoadCustomers(false);
        setCustomers([ {
          id: 1,
          nomeFantasia: ''
        }])
      })
    }
    loadCustomers();
    
    async function loadId(lista){
      await firebase.firestore().collection('chamados')
      .doc(id)
      .get()
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento)
  
        let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
        setCustomerSelected(index);
        setIdCustomer(true);
      })
      .catch((error) => {
        setIdCustomer(false);
        toast.error('Ops! Chamado inexistente!')
        history.push('/dashboard')
      })
    }
  },[id, history])


  // Registra um chamado
  async function handleRegister(e){
    e.preventDefault()

    if(idCustomer){
      await firebase.firestore().collection('chamados')
      .doc(id)
      .update({
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid,
        userName: user.nome
      })
      .then(() => {
        toast.success('Chamado alterado com sucesso!')
        setCustomerSelected(0)
        setComplemento('');
        history.push('/dashboard')
      })
      .catch((error) => {
        console.log(error)
        toast.error('Ops! Erro ao atualizar, tente mais tarde!')
      })
      return;
    }

    await firebase.firestore().collection('chamados')
    .add({
      created: new Date(),
      cliente: customers[customerSelected].nomeFantasia,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid,
      userName: user.nome
    })
    .then(() => {
      toast.success('Chamado criado com sucesso!');
      setComplemento('');
      setCustomerSelected(0);
    })
    .catch((error) => {
      toast.error('Ops! Erro ao registrar, tente mais tarde!')
    })
  }

  // Chama quando altera o Assunto
  function handleChangeSelect(e) {
    setAssunto(e.target.value)
  }

  // Chama quando altera o Status
  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  //Chama quando altera o CLiente
  function handleChangeCustomers(e) {
    setCustomerSelected(e.target.value)
  }

  return(
    <div>
      <Header/>
      <div className='content'>
        <Title name={idCustomer ? 'Editar Chamado' : 'Novo Chamado'}>
          <FiPlusCircle size={25}/>
        </Title>

        <div className='container'>
          <form className='form-profile' onSubmit={handleRegister}>
            <label>Cliente</label>
            {loadCustomers ? (
              <input type="text" disabled={true} value="Buscando clientes..."/>
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomers}>
                {customers.map((item, index) => {
                  return(
                    <option key={item.id} value={index}>{item.nomeFantasia}</option>
                  )
                })}             
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className='status'>
              <input type='radio' name="radio" value="Aberto" onChange={handleOptionChange} checked={ status === 'Aberto' }/><span>Em Aberto</span>
              <input type='radio' name="radio" value="Progresso" onChange={handleOptionChange} checked={ status === 'Progresso' }/><span>Em Progresso</span>
              <input type='radio' name="radio" value="Atendido" onChange={handleOptionChange} checked={ status === 'Atendido' }/><span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea type="text" placeholder='Descreva seu problema (opcional).' value={complemento} onChange={(e) => setComplemento(e.target.value)}/>

            <button type="submit">{idCustomer ? 'Editar' : 'Criar'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}