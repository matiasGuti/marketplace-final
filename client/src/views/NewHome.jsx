import NewCard from '../components/NewCard';
import Footer from './Footer';
import MyContext from '../my-context';
import { useContext } from 'react';

//Estilos
import '../styles/NewHome.css';

function NewHome() {
  const { market } = useContext(MyContext);

  return (
    <>
      <div className='cards-container'>
        <NewCard market={market} />
      </div>
      <Footer />
    </>
  );
}

export default NewHome;
