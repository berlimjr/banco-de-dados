import { styled } from "styled-components";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useState } from "react";
import { API } from "../../services";
import Product from "../../components/Product";

const PageProductsContainer = styled.div`
  padding: 40px 100px;
  background-color: #f9f8fe;
  font-size: 16px;
  & h6 {
    font-size: 16px;
  }
  & .content {
    margin-top: 40px;
  }
  & label{
    cursor: pointer;
  }
`; //vscode styled-components

const PageProducts = () => {
  const [ordenacao, setOrdenacao] = useState(1);
  const tiposDeOrdenacao = [
    {
      name: "Mais relevantes",
      value: 1,
    },
    {
      name: "Menor valor",
      value: 2,
    },
    {
      name: "Maior valor",
      value: 3,
    },
  ];

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [itensFiltrados, setItensFiltrados] = useState([]);
  const [estado, setEstado] = useState("");

  async function getBrands() {
    const response = await API.get("brands");
    setBrands(response.data);
  }

  async function getCategories() {
    const response = await API.get("categories");
    setCategories(response.data);
  }

  async function getGenders() {
    const response = await API.get("genders");
    setGenders(response.data);
  }

  async function getProducts() {
    const response = await API.get("products");
    setProducts(response.data);
    setItensFiltrados([
      ...response.data.sort((a, b) => b.review_rate - a.review_rate)
    ]);
  }


  function checkSelectItems(e){
    let isSelected = e.target.checked;
    let value = e.target.value;
    if(!isSelected){
      setFilters((prevData) => {
        return prevData.filter((item) => item != value);
      });
      return;
    }
    setFilters([...filters, value]);
  }
  useEffect(() => {
    getBrands();
    getCategories();
    getGenders();
    getProducts();
  }, []);
  
  useEffect(() => {
    switch (ordenacao) {
      case 1:
        setItensFiltrados([...itensFiltrados.sort((a, b) => b.review_rate - a.review_rate)]);
      break;
      case 2:
        setItensFiltrados([...itensFiltrados.sort((a, b) => a.product_price - b.product_price)]);
        break;
      case 3:
        setItensFiltrados([...itensFiltrados.sort((a, b) => b.product_price - a.product_price)]);
        break;
    }
  }, [ordenacao, setItensFiltrados]);

  useEffect(() => {
    if(filters.length > 0) {
    const busca = products.filter(p => filters.some(f => f == p.brand_name))
    setItensFiltrados([...busca]);
    return;
    }
    setItensFiltrados([
      ...products.sort((a, b) => b.review_rate - a.review_rate)
    ]);
  }, [filters, products, setFilters])




  return (
    <>
      <PageProductsContainer>
        <div className="flex justify-content-between align-items-center">
          <h6 className="font-normal">
            <b>{'Resultados para "Tenis"'}</b> - 389 Produtos
          </h6>
          <div>
            <h6 className="p-3 border-1 border-round">
              <b>Ordenar por mais relevantes:</b>
              <Dropdown
                value={ordenacao}
                options={tiposDeOrdenacao}
                optionLabel="name"
                optionValue="value"
                onChange={(e) => setOrdenacao(e.target.value)}
                className="border-0 bg-transparent"
              />
            </h6>
          </div>
        </div>
        <div className="content flex gap-3">
          <div className="w-3">
            <div className="bg-white p-4 border-round">
              <h4 className="mb-3">Filtar por:</h4>
              <hr className="mb-3" />
              <h6 className="mb-2">Marcas</h6>
              <ul className="list-style-none">
                {brands.map((marca) => (
                  <li key={marca.brand_id} className="flex gap-3 mb-2">
                    <Checkbox id={marca.brand_name} value={marca.brand_name}
                    onChange={(e) => checkSelectItems(e)}
                    checked={filters.includes(marca.brand_name)}
                    />
                    <label htmlFor={marca.brand_name}>{marca.brand_name}</label>
                  </li>
                ))}
              </ul>
              <h6 className="mb-2 mt-3">Categorias</h6>
              <ul className="list-style-none">
                {categories.map((categorias) => (
                  <li key={categorias.category_id} className="flex gap-3 mb-2">
                    <Checkbox id={categorias.category_name} value={categorias.category_name}
                    onChange={(e) => checkSelectItems(e)}
                    checked={filters.includes(categorias.category_name)}
                    />
                    <label htmlFor={categorias.category_name}>
                      {categorias.category_name}
                    </label>
                  </li>
                ))}
              </ul>
              <h6 className="mb-2 mt-3">Gêneros</h6>
              <ul className="list-style-none">
                {genders.map((generos) => (
                  <li key={generos.gender_id} className="flex gap-3 mb-2">
                    <Checkbox id={generos.genders_name} value={generos.genders_name}
                    onChange={(e) => checkSelectItems(e)}
                    checked={filters.includes(generos.genders_name)}
                    />
                    <label htmlFor={generos.genders_name} onClick={(e) => checkSelectItems(e)}>
                      {generos.genders_name}
                    </label>
                  </li>
                ))}
              </ul>
              <h6 className="mb-2 mt-3">Estado</h6>
              <ul className="list-style-none">
                <li className="flex gap-3 mb-2">
                  <RadioButton 
                    id="novo"
                    onChange={() => setEstado('novo')}
                    checked={estado == 'novo'}
                  />
                  <label htmlFor="novo" onClick={() => setEstado('novo')}>Novo</label>
                </li>
                <li className="flex gap-3 mb-2">
                  <RadioButton 
                      onChange={() => setEstado('usado')}
                      checked={estado == 'usado'}
                  />
                  <label htmlFor="usado" onClick={() => setEstado('usado')}>Usado</label>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-9 flex flex-wrap gap-3">
            {
                itensFiltrados.map((p) => (
                    <Product 
                      key={p.product_id}
                      name={`${p.brand_name} ${p.product_name}`}
                      image={p.product_image}
                      categoryName={p.categoryName}
                      discount={p.product_discount}
                      price={p.product_price}
                    />
                ))
            }
              
          </div>
        </div>
      </PageProductsContainer>
    </>
  )
}
export default PageProducts;