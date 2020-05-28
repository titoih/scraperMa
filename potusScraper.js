const fs = require('fs');
const axios = require('axios');
const $ = require('cheerio', { decodeEntities: true });

const url = 'https://www.milanuncios.com/anuncios/652290494.htm';

const adArray = [];

const axiosData = axios.get(url,{responseType: 'arraybuffer',responseEncoding: 'binary'})
    .then(result => {
        $('.aditem', result.data.toString('binary')).map((i,element) => {
            function checkCVinTitle (cv, model) {
                const cvNoSpace = cv.replace(' ', '');
                if(model){
                    if(model.includes(cv.toUpperCase())) {
                        createAdObject.model = model.replace(cv.toUpperCase(),''); 
                    } 
                    else if(model.includes(cvNoSpace.toUpperCase())){
                        createAdObject.model = model.replace(cvNoSpace.toUpperCase(),''); 
                    }
                    else {
                        // console.log('no model')
                    }
                    return createAdObject.model;
                }
            }
            const capitalize = (str, lower = false) =>
            (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
                
                const createAdObject = {};
                
                // customer data 
                createAdObject.category = 'Coches';
                createAdObject.name = 'Masauto';
                createAdObject.email = 'info@masautotenerife.com';
                createAdObject.renovate = Date();
                createAdObject.phone = `652290494`;
                createAdObject.ip = `::1`;
                createAdObject.ua = `localhost`;
                createAdObject.co = `localhost`;
                // cheerio variables for each parametter
                const titleAndModel = $('.aditem-detail-title', element).text();
                const brandAndPlace = $('.display-desktop.list-location-link', element).text();
                const cv = $('.cc.tag-mobile', element).text();
                const location = $('.list-location-region', element).text();
                // const transmision = $('.cmanual.tag-mobile', element).text();
                const fuel = $('.gas.tag-mobile', element).text() ? $('.gas.tag-mobile', element).text() : $('.die.tag-mobile', element).text();
                const km = $('.kms.tag-mobile', element).text();
                const year = $('.ano.tag-mobile', element).text();
                const doors = $('.ejes.tag-mobile', element).text();
                const description = $('.tx', element).text();
                const price = $('.aditem-price', element).text();
                const vendorType = $('.pillDiv.pillSellerTypePro', element).text();
                const maReference = $('.x5', element).text();
                const vendor = $('.x3', element).text();

                    createAdObject.title = titleAndModel.split(' - ')[0];
                    createAdObject.cv = cv.replace(/[\s,cv]/g,'');
                    createAdObject.carmodel = titleAndModel.split(' - ')[1];
                    checkCVinTitle(cv, createAdObject.model);
                    createAdObject.brand = brandAndPlace.split(' de segunda mano en ')[0];
                    createAdObject.city = brandAndPlace.split(' de segunda mano en ')[1];
                    createAdObject.state = capitalize(location);
                    // createAdObject.transmision = transmision;
                    createAdObject.fuel = fuel.charAt(0).toUpperCase() + fuel.slice(1);
                    createAdObject.km = km ? parseInt(km.replace(/[\.]/, '')) : null;
                    createAdObject.year = year ? parseInt(year.split(' ')[1]) : null;
                    createAdObject.price = price ? parseInt(price.replace(/[\.,€]/, '')) : null;
                    createAdObject.doors = doors.replace(' puertas', '');
                    createAdObject.description = description.replace('\n', ' ');
                    createAdObject.vendorType = vendorType ? vendorType : 'Particular';
                    createAdObject.maReference = maReference.replace(/\s/g,'');
                    createAdObject.vendor = vendor;
                    createAdObject.image = {imgPath:[]};

                    // clean uncompatibilities
                    createAdObject.brand == 'Mercedes benz' ? createAdObject.brand = 'Mercedes-Benz': createAdObject.brand 

                    vendor == 'OFERTA' ? createAdObject.brand != 'Scooters' ? adArray.push(createAdObject)  : '' : '';
        })
    })
    Promise.all([axiosData])
    .then(() => {
        let promises = [];
        const averageImage = 10;
        const fullAdArray = adArray.map( element => {
            for(let i=1; i < averageImage; i++){
                const image = `https://img.milanuncios.com/fg/${element.maReference.slice(1,5)}/${element.maReference.slice(5,7)}/${element.maReference.substr(1)}_${i}.jpg`;
                    promises.push(axios.get(image,{responseType: "stream"})
                        .then(response => {
                            if(response.status == 200){
                                response.data.pipe(fs.createWriteStream(`./uploads/buenanuncio-${element.maReference}_${i}.jpeg`));
                                element.image.imgPath.push(`uploads/buenanuncio-${element.maReference}_${i}.jpeg`)
                            } 
                        })
                        .catch(error => error)
                    )
            }
            return Promise.all(promises)
            .then(() => element)
        })
        return Promise.all(fullAdArray);
    })
    .then(result => console.log(result))
    .catch(error => console.log(error))


