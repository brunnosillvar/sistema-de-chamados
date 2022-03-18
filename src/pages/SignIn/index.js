
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/Auth'
import { Link } from 'react-router-dom';
import './signin.css';
import logo from '../../assets/logo.png';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {signIn, loadingAuth} = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();
    if(email !== '' && password !== ''){
      signIn(email, password);
    }
  }

  return (
    <div className="container-center">
      <div className="login">        
        {!loadingAuth && (
          <>
            <div className="login-area">
              <img src={logo} alt="Sistema Logo" />
            </div>
            <form onSubmit={handleSubmit}>
              <h1>Entrar</h1>
              <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="**************" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Acessar</button>
            </form>
            <Link to="/register">Criar uma conta</Link>
          </>
        )}
        {loadingAuth && (
          <>
            <div className="load">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SignIn;
