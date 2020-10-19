const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
//heroku port || localport 
const port = process.env.PORT || 3000

//Define paths for express config
const publicDirectoryPath = path.join(__dirname,'../public')
//our whole public directory is exposed to the browser.
//when views is saved as templates
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//we need to tell engine which module we have installed.
//this can be done using set method.
//when views folder is saved as views
//app.set('view engine','hbs')

//but when saved as templates
//setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

//rendering homepage
app.get('', (req,res)=>{
    res.render('index',{
        title:'Weather App',
        name: 'Vidhi'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Nature',
        name: 'Vidhi'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Help',
        name:'Vidhi'
    })
})

// //app.com
// //this let us to configure what one should do when one tries to get resource at specific url
// app.get('', (req,res)=>{
//     //this allows us to send something back to the requester
//     res.send('<h1>Weather</h1>')
// })

// //app.com/help
// app.get('/help' , (req,res) => {
//     res.send('Help Page')
// })

// //app.com/about
// app.get('/about' , (req,res) => {
//     res.send('About Page')
// })

//app.com/weather
app.get('/weather' , (req,res) => {

    if(!req.query.address){
        return res.send({
            error:'You must provide an address'
        })
    }

    geocode(req.query.address , (error, { latitude , longitude , location } ={} ) => {
        if(error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error ,forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

})

app.get('/products', (req,res) => {
    res.send({
        products:[]
    })
})

app.get('*',(req,res)=>{
    res.render('error-404',{
        title:'404',
        errorMessage:'Help article not found.',
        name:'Vidhi'
    })
})

//* is provided by express which indicates everything.
//therefore, it is used at last as the express starts to find from the top of the program and if anything matches then it doesn't check further.
//But if nothing matches then the *(wild) route get is executed.
app.get('*',(req,res)=>{
    res.render('error-404',{
        title:'404',
        errorMessage:'Page not found',
        name:'Vidhi'
    })
})

//to start the server 
app.listen(port , ()=>{
    console.log('Server is up on port'+ port)
})