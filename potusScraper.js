const fs = require('fs');
const axios = require('axios');
const $ = require('cheerio', { decodeEntities: true });

const url = 'https://www.milanuncios.com/anuncios/617243433.htm';

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
                // cheerio variables for each parametter
                const titleAndModel = $('.aditem-detail-title', element).text();
                const brandAndPlace = $('.display-desktop.list-location-link', element).text();
                const cv = $('.cc.tag-mobile', element).text();
                const location = $('.list-location-region', element).text();
                const transmision = $('.cmanual.tag-mobile', element).text();
                const fuel = $('.gas.tag-mobile', element).text();
                const km = $('.kms.tag-mobile', element).text();
                const year = $('.ano.tag-mobile', element).text();
                const doors = $('.ejes.tag-mobile', element).text();
                const description = $('.tx', element).text();
                const price = $('.aditem-price', element).text();
                const vendor = $('.pillDiv.pillSellerTypePro', element).text();
                const reference = $('.x5', element).text();
                const type = $('.x3', element).text();

                    createAdObject.title = titleAndModel.split(' - ')[0];
                    createAdObject.cv = cv;
                    createAdObject.model = titleAndModel.split(' - ')[1];
                    checkCVinTitle(cv, createAdObject.model);
                    createAdObject.brand = brandAndPlace.split(' de segunda mano en ')[0];
                    createAdObject.place = brandAndPlace.split(' de segunda mano en ')[1];
                    createAdObject.location = capitalize(location);
                    createAdObject.transmision = transmision;
                    createAdObject.fuel = fuel;
                    createAdObject.km = km;
                    createAdObject.year = year.split(' ')[1]
                    createAdObject.doors = doors;
                    createAdObject.description = description.replace('\n', ' ');
                    createAdObject.vendor = vendor;
                    createAdObject.reference = reference.replace(/\s/g,'');
                    createAdObject.price = price.replace('€', '');
                    createAdObject.type = type;
                    createAdObject.image = {imgPath:[]};
                    type == 'OFERTA' ? createAdObject.brand != 'Scooters' ? adArray.push(createAdObject)  : '' : '';
        })
    })
    Promise.all([axiosData])
    .then(() => {
        let promises = [];
        const averageImage = 10;
        const fullAdArray = adArray.map( element => {
            for(let i=1; i < averageImage; i++){
                const image = `https://img.milanuncios.com/fg/${element.reference.slice(1,5)}/${element.reference.slice(5,7)}/${element.reference.substr(1)}_${i}.jpg`;
                    promises.push(axios.get(image,{responseType: "stream"})
                        .then(response => {
                            if(response.status == 200){
                                response.data.pipe(fs.createWriteStream(`./uploads/buenanuncio-${element.reference}_${i}.jpeg`));
                                element.image.imgPath.push(`uploads/buenanuncio-${element.reference}_${i}.jpeg`)
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
    .then(result => console.log(result) )
    .catch(error => console.log(error))


