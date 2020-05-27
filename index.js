(async()=>{
    if(type != 'OFERTA') return;
    const result = await axios.get(url,{responseType: 'arraybuffer',responseEncoding: 'binary'})
    // $.map instead $.each as map rtn [] and each rtns undefined
    const adArray = await $('.aditem', result.data.toString('binary')).map( async (index, element) => {
        const createAdObject = adObject(element);
        if(createAdObject.brand == 'Scooters') return;
        const averageImage = 5;
        const promises = Array.from({length: averageImage}, async (_, i) => {
            let image = imageStr(i, createAdObject)
            return axios.get(image)
        })
        const images = await Promise.all(promises)
        createAdObject.image.push(...images)
        return createAdObject
    })
})