import CardProducto from './CardProducto';

function NewCard({ market, paginaFav=false }) {
  const dataFormateada = market.map((item) => {
    return {
      ...item,
      precio: Number(item.precio),
    };
  });

  return (
    dataFormateada &&
    dataFormateada.map((producto) => (
      <CardProducto producto={producto} key={producto.id_producto} paginaFav={paginaFav} />
    ))
  );
}

export default NewCard;
