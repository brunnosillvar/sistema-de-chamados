import { useState, useEffect } from 'react';
import './customers.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

const listRef = firebase.firestore().collection('customers');

export default function Customers(){
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [customersList, setCustomersList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {    
    loadClientes();
    return() => {

    }
  },[loadClientes, setLoading])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadClientes(){
    await listRef.limit(5)
    .get()
    .then((snapshot) => {
      updateState(snapshot);
    })
    .catch((error) => {
      
    })
    setLoading(false)
  }

  async function updateState(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;
    if(!isCollectionEmpty){
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nomeFantasia: doc.data().nomeFantasia,
          cnpj: doc.data().cnpj,
          endereco: doc.data().endereco,          
        })
      })      
      setCustomersList(lista);
    }
    else {
      setIsEmpty(true);
    }   
  }

  async function handleAdd(e){
    e.preventDefault();
    if(nomeFantasia !== '' && cnpj !== '' && endereco !== ''){
      await firebase.firestore().collection('customers')
      .add({
        nomeFantasia: nomeFantasia,
        cnpj: cnpj,
        endereco: endereco
      })
      .then(() => {
        setNomeFantasia('');
        setEndereco('');
        setCnpj('');
        toast.info('Empresa cadastrada com sucesso!')
        loadClientes();
      })
      .catch(() =>{
        toast.error('Erro ao cadastrar essa empresa')
      })
    }else {
      toast.error('Preencha todos os campos!')
    }
    
  }

  return(
    <div>
      <Header/>
      <div className='content'>
        <Title name="Clientes">
          <FiUser size={25}/>
        </Title>
      
        <div className='container'>
          <form className='form-profile customers' onSubmit={handleAdd}>
            <label>Nome Fantasia</label>
            <input type='text' placeholder='Nome da empresa' value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)}/>

            <label>CNPJ</label>
            <input type='text' placeholder='CNPJ' value={cnpj} onChange={(e) => setCnpj(e.target.value)}/>

            <label>Endereço</label>
            <input type='text' placeholder='Endereço da empresa' value={endereco} onChange={(e) => setEndereco(e.target.value)}/>

            <button type='submit'>Cadastrar</button>
          </form>          
        </div>
        {loading && (
          <div className='container load-customers-container'>
            <div class="load-customers">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        )} 
        {!isEmpty && !loading && (
          <div className='container customers-cadastrados'>
            <div>
              <h3>Clientes Cadastrados</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th scope="col">Nome Fantasia</th>
                  <th scope="col">CNPJ</th>
                  <th scope="col">Endereço</th>
                  {/* <th scope="col">Cadastrado em</th> */}
                  {/* <th scope="col">#</th> */}
                </tr>
              </thead>
              <tbody>
                {customersList.map((item, index) => {
                  return(
                    <tr key={index}>
                      <td data-label="Cliente">{item.nomeFantasia}</td>
                      <td data-label="Assunto">{item.cnpj}</td>
                      <td data-label="Status">{item.endereco}</td>
                      {/* <td data-label="Cadastrado">{item.createdFormated}</td> */}
                      {/* <td data-label="#">
                        <button title="Visualizar" className="action" style={{backgroundColor: '#3583f6'}} onClick={() => togglePostModal(item)}>
                          <FiSearch color="#fff" size={17}/>                          
                        </button>
                        <Link to={`/new/${item.id}`} className="action" style={{backgroundColor: '#f6a935'}}>
                          <FiEdit2 color="#fff" size={17}/>
                        </Link>
                      </td> */}
                    </tr>
                  )
                })}                
              </tbody>
            </table>
          </div>
        )}
        {isEmpty && !loading && (
          <div className='container customers-cadastrados'>
            <div>
              <h3>Nenhum cliente cadastrado!</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}