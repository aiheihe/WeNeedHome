const GD_KEY = '3516167bec22477cab50d7b15fc4df89'
const GD_API = `http://restapi.amap.com/v3/geocode/geo?key=${GD_KEY}&address=`
const axios = require('axios')

const fs = require('fs')

let houseData = require('./data.json')

// console.log(houseData)
let address = []
houseData.forEach(item => {
    item.children.forEach(si => {
        si.children.forEach(sii => {
            address.push({
                name: `${item.name}${si.name}${sii.name}`,
                month: sii.month || '',
                link: sii.link || '',
            })
        })
    })
})
console.log('address', address.length)
address = address.slice(200, 300)
console.log('address---', address.length)
fs.writeFileSync('address-list.json', JSON.stringify(address, null, 4))
const result = []
address.forEach(async (item, index) => {
    let { data } = await axios.get(`${GD_API}${encodeURI(item.name)}`)
    console.log(`${GD_API}${encodeURI(item.name)}`)
    const { geocodes } = data
    if (!geocodes) {
        return
    }
    const { location } = geocodes[0]
    const longitudeAndLatitude = location.split(',')
    let obj = {
        ...item,
    }
    if (data.info === 'OK') {
        obj.lng = longitudeAndLatitude[0]
        obj.lat = longitudeAndLatitude[1]
        obj.geocode = JSON.stringify(geocodes)
    }
    result.push(obj)
    if (index === address.length - 1) {
        console.log('result length', result.length)
        fs.writeFileSync('outputData3.json', JSON.stringify(result, null, 4))
    }
})
