import React, { useEffect, useState } from 'react';
import axios from 'axios'
import ListProduct from '../ListProduct'

import {handlePercentDiscount} from '../../../untils/index'
import { useDispatch } from 'react-redux';


function Oppo(props) {
    const dispatch = useDispatch()
    const [name, setName] = useState('oppo');
    const [hotOppo, setHotOppo] = useState([])

    useEffect(() => {
        async function FetchApi(){
            try {
                const {data} = await axios.get(`http://localhost:5000/products/${name}`)
                setHotOppo(data)
            } catch (error) {
                console.log(error)
            }
        }
        FetchApi()
    }, [])

    return (
        <section id="hotsale">
            <div className="hotsale">
                <h2>{name}</h2>
                {
                   hotOppo ? (<ListProduct HotSaleProducts={handlePercentDiscount(hotOppo)}></ListProduct>) : ''
                }
            </div>
        </section>

    );
}


export default Oppo;