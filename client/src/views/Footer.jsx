import React from 'react';
import imagen from '../assets/img/96841538.png';
import imagen2 from '../assets/img/104594603.jpg';
import imagen3 from '../assets/img/106690319.jpg';
import '../styles/FooterUno.css';

const Footer = () => {
  return (
    <div className='footer text-center'>
      <h1>Creadores</h1>
      <div className='row'>
        <div className='col-lg-4'>
          <h2 className='fw-normal'>Matias</h2>
          <img className='imgFooter' src={imagen} alt='96841538.png' />
          <p>Ingeniero civil industrial. Actual estudiante de Desafiolatam.</p>
        </div>

        <div className='col-lg-4'>
          <h2 className='fw-normal'>Felo</h2>
          <img className='imgFooter' src={imagen2} alt='106690319.jpg' />
          <p>Músico. Actual estudiante de Desafiolatam.</p>
        </div>

        <div className='col-lg-4'>
          <h2 className='fw-normal'>Daniel</h2>
          <img className='imgFooter' src={imagen3} alt='104594603.jpg' />
          <p>
            Ingeniero en maquinaria y vehículos automotrices. Actual estudiante
            de Desafiolatam.
          </p>
        </div>
      </div>

      <div>
        <p>&copy; 2022–2023 Desafiolatam, Inc. &middot; </p>
      </div>
    </div>
  );
};

export default Footer;
