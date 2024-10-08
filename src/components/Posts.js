import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars } from '../slices/carSlice';
import Loader from './Loader';
import './Posts.css';

function Posts({vehicle}) {

    const dispatch = useDispatch();
    const cars = useSelector(state => state.cars.cars);
    const status = useSelector(state => state.cars.status);
    const error = useSelector(state => state.cars.error);

    useEffect(() => {

      window.scrollTo(0, 0);
  
        if (status === 'idle') {
          dispatch(fetchCars(vehicle));
        }
      }, [status, dispatch]);
    
      if (status === 'loading') {
        return <Loader />;
      } 
    
      if (status === 'failed') {
        return <div>Error: {error}</div>;
      }
      
    return (
        <div className="car-container">
            {cars.map((car) => (
            
             <div id="car" className="car" key={car.id} >
              <Link to={`/car/${car.id}` } className='car-link'>
                <div className="car-image">
                    <img src={car.image[0]} alt={car.Makes.make_name}  />
                </div>
                <div className="info">
                    <p id="mark">{car.Makes.make_name}  {car.Models.model_name}</p>
                    <p className="price">{car.price}$</p>
                </div>

                <div className="engine">
                    <p className="fuel">{car.fuel} | {car.ccm + 'ccm'}</p>
                    <p className="second-price">{car.price}$</p>
                    <p className="year">{car.year}</p>
                </div>      
              </Link> 
            </div>
            
))}
            </div>
    )
}

export default Posts;