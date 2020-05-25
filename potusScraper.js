const fs = require('fs')
const axios = require('axios');
const $ = require('cheerio', { decodeEntities: true });

const url = 'https://www.milanuncios.com/anuncios/652290494.htm';

const adArray = [];

var axiosData = axios.get(url,{responseType: 'arraybuffer',responseEncoding: 'binary'})
    .then(result => {
        const myP = $('.aditem', result.data.toString('binary')).each((i, element) => {
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
                // const image = $('img', element)[0].attribs.src
                // const numberImages = $('.mini-overlay-superior', element).text();

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
                    createAdObject.image = [];
                    // function generate array images
                        let promises = [];
                        const averageImage = 5;
                        for(let i=1; i < averageImage; i++){
                            const image = `https://img.milanuncios.com/fg/${createAdObject.reference.slice(1,5)}/${createAdObject.reference.slice(5,7)}/${createAdObject.reference.substr(1)}_${i}.jpg`;
                            promises.push(axios.get(image)
                                .then(response => {
                                    // response.status == 200 ? createAdObject.image.push(image) : console.log('something wrong with images')
                                    response.status == 200 ? createAdObject.image.push(image) : ''
                                    })
                                .catch(error => console.log())
                            )
                        }
                        return Promise.all(promises)
                        .then(() => {
                            type == 'OFERTA' ? createAdObject.brand != 'Scooters' ? adArray.push(createAdObject)  : '' : '';
                            console.log('hey3')
                        })
                        .catch(error => console.log(error))
        })
        return Promise.all([myP])
        .then(() => console.log('hey2'))
    })
    return Promise.all([axiosData])
    .then(() => console.log('hey'))
    .catch(error => console.log(error))

    
    // 305135406
    // axios({
    //     method: "get",
    //     url: "https://img.milanuncios.com/fg/3051/35/305135406_1.jpg",
    //     responseType: "stream"
    // }).then(function (response) {
    //     response.data.pipe(fs.createWriteStream("./testDownload/testName.jpeg"));
    // })
// const t = axios.get('https://img.milanuncios.com/fg/3229/82/322982571_1.jpg')
//     .then (result => {return 'hey'})
//     .catch (error => console.log(error))

//     return Promise.all([u, t]).then(function(values) {
//         console.log(values);
//       });

// return Promise.all([axiosData])
// .then(after => {
//     console.log(adArray)
//     return adArray
// })


