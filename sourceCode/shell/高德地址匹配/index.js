const GD_KEY = '3516167bec22477cab50d7b15fc4df89'
const GD_API = `http://restapi.amap.com/v3/geocode/geo?key=${GD_KEY}&address=`
const axios = require('axios')

const fs = require('fs')

let { houseData } = require('./data.js')

let address = []
houseData.forEach(item => {
    item.children.forEach(si => {
        si.children.forEach(sii => {
            address.push(`${item.title}${si.title}${sii}`)
        })
    })
})
const result = []
address.forEach(async (item, index) => {
    let { data } = await axios.get(`${GD_API}${encodeURI(item)}`)
    const { geocodes } = data
    if (!geocodes) {
        return
    }
    const { location } = geocodes[0]
    const longitudeAndLatitude = location.split(',')
    let obj = {
        address: item,
    }
    if (data.info === 'OK') {
        obj.lng = longitudeAndLatitude[0]
        obj.lat = longitudeAndLatitude[1]
        obj.geocode = JSON.stringify(geocodes)
    }
    result.push(obj)
    if (index === address.length - 1) {
        fs.writeFileSync('outputData.json', JSON.stringify(result, null, 4))
    }
})
