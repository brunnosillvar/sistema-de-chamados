import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import AuthProvider from './contexts/Auth';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer autoClose={3000}/>
          <Routes/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
