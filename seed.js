require('../config/db.config');

const mongoose = require('mongoose');
const Ad = require('../models/ad.model');

const dataAdSample = [
  {
    reference:'',
    email:'pepe@hotmail.com',
    type: 'OFERTA',
    title:'Doy empleo a persona seria',
    city: 'Madrid',
    category:'Empleo',
    description:'Para limpieza por las tardes'
  },
  {
    reference:'',
    email:'manoli@gmail.com',
    type: 'DEMANDA',
    title:'Busco empleo urgente',
    city: 'Madrid',
    category:'Empleo',
    description:'Puedo limpiar cocinar'
  },
  {
    reference:'',
    email:'marcos@hotmail.es',
    type: 'OFERTA',
    title:'Necesito cuidador',
    city: 'Madrid',
    category:'Empleo',
    description:'para persona mayor 65 años recien jubilida'
  }
];

Ad.create(dataAdSample)
.then(()=> {
  console.log('Works')
})
.catch(err => console.log('Something wrong', err))
.then(() => mongoose.connection.close())