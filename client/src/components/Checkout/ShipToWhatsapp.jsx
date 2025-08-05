import { useEffect, useState } from "react";
import axios from 'axios';


const ShipToWhatsapp = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:1000/api/products/');
      setProducts(res.data);
    } catch (error) {
      setError(error.message);
      console.error(error);
      console.log(products);
    }
  };

  useEffect(() => {
    fetchProducts()
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.$loki}>
              {product.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShipToWhatsapp