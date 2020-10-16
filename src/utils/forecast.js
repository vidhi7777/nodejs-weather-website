const request = require('postman-request')

const forecast = (latitude , longitude , callback ) => {

    const url = 'http://api.weatherstack.com/current?access_key=a4cf8945d5cd606011bbd86121aaf4a1&query=' + latitude +',' + longitude +'&units=m'

    //request({url:url , json:true} , (error,response) => {
    request({url , json:true} , (error, {body}) => {
        if(error){
            callback ('Unable to connect to weather services!', undefined)
        } else if(body.error){
            callback('Unable to find location. Try another search.',undefined)
        } else{
            callback(undefined, body.current.weather_descriptions[0]+ '. It is currently ' + body.current.temperature + ' degrees. But it feels like '+ body.current.feelslike + ' degrees.')
        }
    })
}    

module.exports = forecast