const express=require('express');
const cors=require('cors');
const logger=require('morgan');//for seeing api calls in the terminal
const bodyParser=require('body-parser')
const path=require('path')


const app=new express();

require('./Middlewares/mongoDb') // to initialise mongoose

const PORT=process.env.PORT || 3200
app.use(bodyParser.json())
app.use(cors())          //to connect frontend and backend without any disturbances
app.use(express.json())       //to receive data from front end
app.use(express.urlencoded({extended:true}))
app.use(logger('dev'))
app.use(express.static('./dist/frontend'));

const api=require('./routes/api')
app.use('/api',api)

app.get('/*', function(req, res) 
{   
    res.sendFile(path.join(__dirname + '/dist//frontend/index.html'));
}); 

app.listen(PORT,()=>{
    console.log(`.......Server is listening at port ${PORT}........`)

})