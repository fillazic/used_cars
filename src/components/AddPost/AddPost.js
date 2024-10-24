
import React, { useState, useEffect } from 'react';
import {supabase} from '../../config/supaBase';
import { useUser } from '@supabase/auth-helpers-react';
import {v4 as uuidv4} from 'uuid';
import Vehicle from '../Forms/Vehicle';
import Login from '../Login';
import Loader from '../Loader';
import './AddPost.css';

const CDNURL= "https://dcyhbisdusfgptxeuczc.supabase.co/storage/v1/object/public/car-images/";

function AddPost () {
    const user = useUser();

    const [make, setMake] = useState([]);
    const [model, setModel] = useState([]);
    const [year, setYear] = useState('');
    const [price, setPrice] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [fuel, setFuel] = useState('');
    const [kv, setKv] = useState('');
    const [ccm, setCcm] = useState('');
    const [transmission, setTransmission] = useState('');
    const [color, setColor] = useState('');
    const [door, setDoor] = useState('');
    const [seats, setSeats] = useState('');
    const [aircon,setAircon] = useState('');
    const [emission, setEmission] = useState('');
    const [interior, setInterior] = useState('');
    const [safety, setSafety] = useState('');
    const [feature, setFeature] = useState('');
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [otherphone, setOtherphone] = useState('');
    const [addres, setAddres] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedModelId, setSelectedModelId] = useState('');
    const [selectedMakeId, setSelectedMakeId] = useState('');
    const [form, setForm] = useState(false);
    let[imgs, setImgs] = useState([]);
    const years = [];

    for (let i = 2024; i > 1905; i--) {
      years.push(i);
    }
  
    useEffect(() => {
   
    const timer = setTimeout(() => {
        setLoading(false); 
      }, 1500);

    fetchMakes();

    if (selectedMakeId) {
      fetchModelsForMark(selectedMakeId)
    } 

    return () => clearTimeout(timer);

    }, [user, selectedMakeId, imgs]);

  
//Auth

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImgs((prevImgs) => [...prevImgs, ...selectedFiles]);
       console.log(imgs)
      };

    const handleDelete = (index) => {
        setImgs((prevImgs) => prevImgs.filter((_, i) => i !== index));
      };

//safety
      const handleCheckboxChange = (e) => {
          const value = e.target.value;
      
          // If checkbox is checked, add the value to the array
          if (e.target.checked) {
              setSafety((prevSafety) => [...prevSafety, value]);
          } else {
              // If checkbox is unchecked, remove the value from the array
              setSafety((prevSafety) =>
                  prevSafety.filter((feature) => feature !== value)
              );
          }
      
          console.log(safety);  // Log the updated array for testing
      };

//feature
const handleCheckboxFeatures = (e) => {
  const value = e.target.value;

  // If checkbox is checked, add the value to the array
  if (e.target.checked) {
      setFeature((prevFeature) => [...prevFeature, value]);
  } else {
      // If checkbox is unchecked, remove the value from the array
      setFeature((prevFeature) =>
          prevFeature.filter((features) => features !== value)
      );
  }

  console.log(feature);  // Log the updated array for testing
};

    const fetchModelsForMark = async (selectedMakeId) => {
      const { data, error } = await supabase
        .from('Models')
        .select('id, model_name')
        .eq('make_id', selectedMakeId);
  
      if (error) {
        console.error('Error fetching models:', error);
        return;
      }
  
      setModel(data || []);
    };

    const fetchMakes = async () => {
      const { data, error } = await supabase
        .from('Makes')
        .select('id, make_name');
  
      if (error) {
        console.error('Error fetching makes:', error);
        return;
      }
  
      setMake(data || []);
    };
  
    const handleMarkChange = (e) => {
      setSelectedMakeId(e.target.value);
    };
 

    const getImages = async (subfolder) => {
        const { data, error } = await supabase
          .storage
          .from('car-images')
          .list(user?.id + "/" + subfolder + "/", {
            limit: 100,
            offset: 0,
            sortBy: { column: "updated_at", order: "asc" }
          });
      
        if (data) {
          const urls = data.map(image => `${CDNURL}${user.id}/${subfolder}/${image.name}`);
          return urls; 
        } else {
          console.log(error);
          return []; 
        }
      }
  
      const uploadImages = async (e) => {
        let subfolder = 'images' + uuidv4();
      
        for (const file of e) {
          console.log(file);
          const { data, error } = await supabase
            .storage
            .from('car-images')
            .upload(user.id + "/" + subfolder + "/" + uuidv4(), file);
      
          if (data) {
            console.log('Image uploaded successfully');
          } else {
            console.log(error);
          }
        }
      
        
        const images = await getImages(subfolder);
        return images;
      };

    const handleSubmit = async (e) => {
      {!user? alert('If you want to post an ad, you must be logged in') :
      e.preventDefault();
      setUploading(true);
      const images = await uploadImages(imgs);
      const { error: carError } = await supabase
        .from('Car')
        .insert([
          {
            make_id: selectedMakeId,
            model_id: selectedModelId,
            year,
            price,
            vehicleType,
            fuel,
            safety,
            feature,
            image: images,
            ccm: ccm,
            kv: kv,
            transmission: transmission,
            color: color,
            doors: door,
            seats: seats,
            air_condition: aircon,
            emission: emission,
            interior: interior,
            description: message,
            name: name,
            last_name: lastname,
            phone_number: phone,
            other_phone_number: otherphone,
            addres: addres,
            city: city,
            userID: user.id,

          },
        ]);


      if (carError) {
        console.error('Error inserting car:', carError);
        setUploading(false);
        return;
      }
  
      setUploading(false);
      alert('Your ad has been successfully created')
    }
    };
  
    return (
        <div className='form' >
          {loading ? <Loader /> :
          <>
            <div className='vehicle-ap'><Vehicle /></div>
             <form onSubmit={handleSubmit} >
                <div className='model' >
                    <div className='selected-container'>
                        <select value={selectedMakeId} name="mark" id="selected-items" onChange={handleMarkChange} required>
                                <option value="" disabled hidden>Make</option>
                                {make.map((makes) => (
                                <option key={makes.id} value={makes.id}>
                                {makes.make_name}
                                </option>
                                ))} 
                        </select>
                        <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                        </div>
                    </div>
                    <div className='selected-container'>
                    <select disabled={!selectedMakeId} value={selectedModelId} name="mark" id="selected-items" onChange={(e) => setSelectedModelId(e.target.value)} required >
                                <option value="">Model</option>
                                {model.map((models) => (
                                <option key={models.id} value={models.id}>
                                {models.model_name}
                                </option>
                                ))} 
                    </select>
                    <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                    </div>
                    </div>
                    <input type='number' min={0} id='ap-input' name='price' placeholder='Price in €'  onChange={(e) => setPrice(e.target.value)} />
                </div>

                <div className='features'>
                    <div className='selected-container'>
                        <select type='text' name="year" id="selected-items" onChange={(e) => setYear(e.target.value)} required >
                            <option>Year</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                              {year}
                              </option>
                            ))}                       
                        </select>
                        <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                        </div>
                    </div>

                    <div className='selected-container'>                    
                        <select name="type" type='text' id="selected-items" onChange={(e) => setVehicleType(e.target.value)} required >
                                <option value="Vehicle-type" >Vehicle type</option>
                                <option value="Saloon">Saloon</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Estate-Car">Estate Car</option>
                                <option value="Estate-Car">SUV</option>
                                <option value="Off-road">Off-road</option>
                                <option value="Sports">Sports Car/Coupe</option>
                                <option value="Estate-Car">Pickup Truck</option>
                                <option value="Van">Van/Minibus</option>
                        </select>
                        <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                        </div>
                    </div>
                    <div className='selected-container'>
                        <select type='text' name="fuel" id="selected-items" onChange={(e) => setFuel(e.target.value)} required>
                                <option value="Fuel" >Fuel</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electic">Electic</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Natural gas">Natural gas</option>
                        </select>
                        <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                        </div>
                    </div>
                </div>
        
            <div className='detail-form-visible' >
                <div className="power" >
                      <input id='ap-input' min={0} type="number"  name="kw" placeholder="kW" onChange={(e)=> setKv(e.target.value)} required/>
                      <input id='ap-input' min={0} type="number" name="ccm" placeholder="ccm" onChange={(e)=> setCcm(e.target.value)} required/>

                    <div className='selected-container'>
                        <select name="trensmission" id="selected-items" value={transmission} onChange={(e)=> setTransmission(e.target.value)} required>
                            <option value="">Transmission</option>
                            <option value="Automatic" >Automatic</option>
                            <option value="Manual gearbox">Manual gearbox</option>
                            <option value="Semi-automatic">Semi-automatic</option>
                        </select>
                        <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                        </div>
                    </div>
                </div>
            </div>

                <div className='feature-one' >
                <div className='selected-container'>
                    <select name="color" id="selected-items" value={color} onChange={(e)=> setColor(e.target.value)} required>
                        <option value="" >Color</option>
                        <option>Silver</option>
                        <option>Grey</option>
                        <option>Black</option>
                        <option>White</option>
                        <option>Blue</option>
                        <option>Red</option>
                        <option>Beige</option>
                        <option>Gold</option>
                        <option>Purple</option>
                        <option>Yellow</option>
                        <option>Metallic</option>
                        <option>Brown</option>
                        <option>Green</option>
                        <option>Orange</option>
                        <option>Matte</option>
                    </select>
                    <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                    </div>
                </div>

                <div className='selected-container'>
                    <select name="door" id="selected-items" value={door} onChange={(e)=> setDoor(e.target.value)} required>
                        <option value="" >Number of doors</option>
                        <option >2/3</option>
                        <option >4/5</option>
                    </select>
                    <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                    </div>
                </div>

                <div className='selected-container'>
                    <select name="seats" id="selected-items" value={seats} onChange={(e)=> setSeats(e.target.value)} required>
                        <option value="" >Number of seats</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>                     
                    </select>
                    <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                    </div>
                </div>

                </div>

                <div className='feature-two' >
                    <div className='selected-container'>
                        <select name="AC" id="selected-items" value={aircon} onChange={(e)=> setAircon(e.target.value)} required>
                            <option value="Air-condition" >Air-condition</option>
                            <option value="No-AC">No air conditioning</option>
                            <option value="Manual-AC">Manual air conditionig</option>
                            <option value="Automatic-AC">Automatic air conditioning</option>
                        </select>
                        <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                        </div>
                    </div>

                    <div className='selected-container'>
                        <select name="emission" id="selected-items" value={emission} onChange={(e)=> setEmission(e.target.value)} required>
                            <option value="Any" >Emission</option>
                            <option value="Euro1">Euro1</option>
                            <option value="Euro2">Euro2</option>
                            <option value="Euro3">Euro3</option>
                            <option value="Euro4">Euro4</option>
                            <option value="Euro5">Euro5</option>
                            <option value="Euro6">Euro6</option>
                            <option value="Euro6c">Euro6c</option>
                            <option value="Euro6d-TEMP">Euro6d-TEMP</option>
                            <option value="Euro6d">Euro6d</option>
                        </select>
                        <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                        </div>
                    </div>

                    <div className='selected-container'>
                        <select name="Interior" id="selected-items" value={interior} onChange={(e)=> setInterior(e.target.value)} required>
                            <option value="Interior" >Interior</option>
                            <option value="Cloth">Cloth</option>
                            <option value="Full-leather">Full-leather</option>
                        </select>
                        <div className='icon'>
                            <i className='fa fa-caret-down' ></i>
                        </div>
                    </div>
                </div>

                <div className='images'>
                  <label htmlFor='file-upload' className='custom-file-upload'>
                    Upload Images
                  </label>
                  <input id='file-upload' type='file' multiple onChange={handleFileChange} />

                  <div className='image-container'>
                    {imgs.map((file, index) => (
                      <div className="upload-img" key={index}>
                        <img src={URL.createObjectURL(file)} alt={file.name} />
                        <span className='delete-btn' onClick={() => handleDelete(index)} >
                        <i className="fa fa-close"></i>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <h3>Safety</h3>
                <div className='safety' >
                    <div>
                    <input type="checkbox" id="ABS" name="ABS" value="ABS" onChange={handleCheckboxChange} />
                    <label htmlFor="ABS">ABS</label>
                    </div>

                    <div>
                    <input type="checkbox" id="ESP" name="ESP" value="ESP" onChange={handleCheckboxChange} />
                    <label htmlFor="ESP">ESP</label>
                    </div>

                    <div>
                    <input type="checkbox" id="ASR" name="ASR" value="ASR" onChange={handleCheckboxChange} />
                    <label htmlFor="ASR">ASR</label>
                    </div>

                    <div>
                    <input type="checkbox" id="driven-airbags" name="driven-airbags" value="Driven Airbags" onChange={handleCheckboxChange} />
                    <label htmlFor="driven-airbags" >Driven Airbags</label>
                    </div>

                    <div>
                    <input type="checkbox" id="front-airbags" name="front-airbags" value="Front Airbags"  onChange={handleCheckboxChange} />
                    <label htmlFor="front-airbags">Front Airbags</label>
                    </div>

                    <div>
                    <input type="checkbox" id="side-airbags" name="side-airbagss" value="Side Airbags"  onChange={handleCheckboxChange} />
                    <label htmlFor="side-airbags">Side Airbags</label>
                    </div>

                    <div>
                    <input type="checkbox" id="more-airbags" name="more-airbags" value="More Airbags"  onChange={handleCheckboxChange} />
                    <label htmlFor="more-airbags">More Airbags</label>
                    </div>

                    <div>
                    <input type="checkbox" id="alarm" name="alarm" value="Alarm system"  onChange={handleCheckboxChange} />
                    <label htmlFor="alarm">Alarm system</label>
                    </div>

                    <div>
                    <input type="checkbox" id="central-lock" name="central-lock" value="Central lock"  onChange={handleCheckboxChange} />
                    <label htmlFor="central-lock">Central lock</label>
                    </div>

                    <div>
                    <input type="checkbox" id="child-lock" name="child-lock" value="Child Lock"  onChange={handleCheckboxChange} />
                    <label htmlFor="child-lock">Child lock</label>
                    </div>

                    <div>
                    <input type="checkbox" id="blind-spot" name="blind-spot" value="Blind spot monitor"  onChange={handleCheckboxChange} />
                    <label htmlFor="blind-spot">Blind spot</label>
                    </div>

               
            </div>
                <h3>Features</h3>
                <div className='all-feature'>
                    
                    <div>
                    <input type="checkbox" id="metalic-color" name="metalic-color" value="Metalic color" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="metalic-color">Metalic color</label>
                    </div>
                    
                    <div>
                    <input type="checkbox" id="power-steering" name="power-steering" value="Power steering" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="power-steering">Power steering</label>
                    </div>
                    
                    <div>
                    <input type="checkbox" id="remote-locking" name="remote-locking" value="Remote locking" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="remote-locking">Remote locking</label>
                    </div>

                    <div>
                    <input type="checkbox" id="trip-computer" name="trip-computer" value="Trip computer" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="trip-computer">Trip computer</label>
                    </div>

                    <div>
                    <input type="checkbox" id="sunroof" name="sunroof" value="Sunroof" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="sunroof">Sunroof</label>
                    </div>

                    <div>
                    <input type="checkbox" id="tow-hitch" name="tow-hitch" value="Tow hitch" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="tow-hitch">Tow hitch</label>
                    </div>
                    
                    <div>
                    <input type="checkbox" id="panoramic-roof" name="spanoramic-roof" value="Panoramic roof" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="panoramic-roof">Panoramic roof</label>
                    </div>

                    <div>
                    <input type="checkbox" id="tinted-windows" name="tinted-windows" value="Tinted windows" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="tinted-windows" >Tinted-windows</label>
                    </div>

                    <div>
                    <input type="checkbox" id="electric-windows" name="electric-windows" value="El. windows" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="electric-windows">El. windows</label>
                    </div>
                    
                    <div>
                    <input type="checkbox" id="electric-mirrors" name="electric-mirrors" value="El. mirrors" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="electric-mirrors">El. mirrors</label>
                    </div>
                    
                    <div>
                    <input type="checkbox" id="mirror-heaters" name="mirror-heaters" value="Mirror heaters" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="mirror-heaters">Mirror heaters</label>
                    </div>

                    <div>
                    <input type="checkbox" id="s.-wheel-heater" name="s.-wheel-heater" value="S. wheel heater" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="s.-wheel-heater">S. wheel heater</label>
                    </div>

                    <div>
                    <input type="checkbox" id="height-adj-seat" name="height-adj-seat" value="Height adj. seat" onChange={handleCheckboxFeatures}/>
                    <label htmlFor="height-adj-seat">Height adj. seat</label>
                    </div>

                    <div>
                    <input type="checkbox" id="electrically-adj-seat" name="electrically-adj-seat" value="El. adj. seat" onChange={handleCheckboxFeatures} />
                    <label htmlFor="electrically-adj-seat">El. adj. seat</label>
                    </div>

                    <div>
                    <input type="checkbox" id="seat-heaters" name="seat-heaters" value="Seat heaters" onChange={handleCheckboxFeatures} />
                    <label htmlFor="seat-heaters">Seat heaters</label>
                    </div>

                    <div>
                    <input type="checkbox" id="fog-lights" name="fog-lights" value="Fog lights" onChange={handleCheckboxFeatures} />
                    <label htmlFor="fog-lights">Fog lights</label>
                    </div>

                    <div>
                    <input type="checkbox" id="xenon-lights" name="xenon-lights" value="Xenon lights" onChange={handleCheckboxFeatures} />
                    <label htmlFor="xenon-lights">Xenon lights</label>
                    </div>

                    <div>
                    <input type="checkbox" id="lights-sensors" name="lights-sensors" value="Lights sensors" onChange={handleCheckboxFeatures} />
                    <label htmlFor="lights-sensors">Lights sensors</label>
                    </div>

                    <div>
                    <input type="checkbox" id="rain-sensors" name="rain-sensors" value="Rain sensors" onChange={handleCheckboxFeatures} />
                    <label htmlFor="rain-sensors">Rain sensors</label>
                    </div>

                    <div>
                    <input type="checkbox" id="parking-sensors" name="parking-sensors" value="Praking sensors" onChange={handleCheckboxFeatures} />
                    <label htmlFor="parking-sensors">Parking sensors</label>
                    </div>

                    <div>
                    <input type="checkbox" id="roof-rack" name="roof-rack" value="Roof rack" onChange={handleCheckboxFeatures} />
                    <label htmlFor="roof-rack">Roof rack</label>
                    </div>

                    <div>
                    <input type="checkbox" id="aluminum-rims" name="aluminum-rims" value="Aluminum rims" onChange={handleCheckboxFeatures} />
                    <label htmlFor="aluminum-rims">Aluminum rims</label>
                    </div>

            </div>

            <div className="textarea-container">
              <label htmlFor="message">About Ad</label>
              <textarea
                id="message"
                placeholder="Type here..."
                value={message}
                onChange={(e)=> setMessage(e.target.value)}>
                </textarea>
            </div>

            <div className="power" >
                  <input id='ap-input' type="text"  placeholder="Name" onChange={(e)=> setName(e.target.value)} required/>
                  <input id='ap-input' type="text"  placeholder="Last Name" onChange={(e)=> setLastname(e.target.value)} required/>
                  <input id='ap-input' type="phone" placeholder="Phone number" onChange={(e)=> setPhone(e.target.value)} required/>
            </div>

            <div className="power" >
                  <input id='ap-input' type="phone" placeholder="Other phone number" onChange={(e)=> setOtherphone(e.target.value)}/>  
                  <input id='ap-input' type="text"  placeholder="Addres" onChange={(e)=> setAddres(e.target.value)} />
                  <input id='ap-input' type="text"  placeholder="City" onChange={(e)=> setCity(e.target.value)} required/>                
            </div>

            <div className='search-button-add' >
                    <button className='hidden-btn'>More Detail</button>
                    <button className='hidden-btn'>More Detail</button>
                    <button className='search-form' type="submit" disabled={uploading} >
                        {uploading ? 'Uploading...' : 'Post Ad'}
                    </button>
            </div>
            

            </form> 
            </>
          }
        </div>
    )
}

export default AddPost;
