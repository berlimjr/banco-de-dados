import { styled } from "styled-components"
import { Dropdown } from 'primereact/dropdown';    
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';      
import { useEffect, useState } from "react";
import { API } from "../../services";

const PageProductsContainer = styled.div`
    padding: 40px 100px;
    background-color: #f9f8fe;
    font-size: 16px;
    & .content{
        margin-top: 40px;
    }
`;

const PageProducts = () => {
    const [ordenacao, setOrdenacao] = useState(1);
    const tiposDeOrdenacao = [
        {
            name: 'mais relevantes',
            value: 1
        },
        {
            name: 'menor valor',
            value: 2
        },
        {
            name: 'maior valor',
            value: 3
        }
    ]
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [genders, setGenders] = useState([]);
    const [filters, setFilters] = useState([]);
    const [estado, setEstado] = useState('');

    async function getBrands(){
        const response = await API.get('brands');
        setBrands(response.data);
    }
    async function getCategories(){
        const response = await API.get('categories');
        setCategories(response.data);
    }
    async function getGenders(){
        const response = await API.get('genders');
        setGenders(response.data);
    }

    function checkSelectedItems(e){
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
    }, []);

    return (
        <>
            <PageProductsContainer>
                <div className="flex justify-content-between align-items-center">
                    <h6 className="font-normal">
                        <b>Resultados para "Tenis"</b> - 389 produtos
                    </h6>
                    <div>
                        <h6 className="p-3 border-1 border-round">
                            <b>Ordenar por mais relevantes</b>
                            <Dropdown 
                                value={ordenacao}
                                options={tiposDeOrdenacao}
                                optionLabel="name"
                                optionValue="value"
                                onChange={e => setOrdenacao(e.value)}
                                className="border-0 bg-transparent"
                            />
                        </h6>
                    </div>

                </div>
                <div className="flex gap-3 content">
                    <div className="w-3 ">
                        <div className="bg-white p-4 border-round">
                            <h4 className="mb-3">Filtrar por:</h4>
                            <hr  className="mb-3 "/>
                            <h6 className="mb-2">Marca</h6>
                            <ul className="list-style-none">
                                {
                                    brands.map((marca) => (
                                        <li key={marca.brand_id} className="flex gap-2 mb-2">
                                            <Checkbox 
                                            id={marca.brand_name}
                                            value={marca.brand_name}
                                            onChange={(e) => checkSelectedItems(e)}
                                            checked={filters.includes(marca.brand_name)}
                                            />
                                            <label htmlFor={marca.brand_name}>{marca.brand_name}</label>
                                        </li>
                                    ))
                                }
                            </ul>
                            <h6 className="mb-2 mt-3">Categoria</h6>
                            <ul className="list-style-none">
                                {
                                    categories.map((categorias) => (
                                        <li key={categorias.category_id} className="flex gap-2 mb-2">
                                            <Checkbox 
                                                id={categorias.category_name}
                                                value={categorias.category_name}
                                                onChange={(e) => checkSelectedItems(e)}
                                                checked={filters.includes(categorias.category_name)}    
                                            />
                                            <label htmlFor={categorias.category_name}>{categorias.category_name}</label>
                                        </li>
                                    ))
                                }
                            </ul>
                            <h6 className="mb-2 mt-3">Gênero</h6>
                            <ul className="list-style-none">
                                {
                                    genders.map((gen) => (
                                        <li key={gen.genders_id} className="flex gap-2 mb-2">
                                            <Checkbox 
                                                id={gen.genders_name}
                                                value={gen.genders_name}
                                                onChange={(e) => checkSelectedItems(e)}
                                                checked={filters.includes(gen.genders_name)}
                                            />
                                            <label htmlFor={gen.genders_name}>{gen.genders_name}</label>
                                        </li>
                                    ))
                                }
                            </ul>
                            <h6 className="mb-2 mt-3">Estado</h6>
                            <ul className="list-style-none">
                                <li className="flex gap-2 mb-2"><RadioButton 
                                    id="Novo"
                                    onChange={(e) => setEstado('novo')}
                                    checked={estado == 'novo'}
                                />
                                    <label onClick={() => setEstado('novo')} htmlFor="marca1">Novo</label>
                                </li>
                                <li className="flex gap-2 mb-2"><RadioButton 
                                    id="Usado"
                                    onChange={(e) => setEstado('usado')}
                                    checked={estado == 'usado'}
                                />
                                    <label onClick={() => setEstado('usado')} htmlFor="marca1">Usado</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-9 ">Card</div>
                </div>

            </PageProductsContainer>
        </>
    )

}

export default PageProducts;
