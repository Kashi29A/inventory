var Db  = require('./dboperations');
var FHS = require('./fhs');
const dboperations = require('./dboperations');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

dboperations.getFHSs().then((res)=>{
    console.log(res)
})

app.use('/api', router);


router.use((request,response,next)=>{
   console.log('middleware');
   next();
})

router.route('/fhs').get((request,response)=>{
    dboperations.getFHSs().then(result => {
       response.json(result[0]);
    })

})

router.route('/ACH').get((request,response)=>{
    dboperations.getACH().then(result => {
       response.json(result[0]);
    })

})
router.route('/SLEH').get((request,response)=>{
    dboperations.getSLEH().then(result => {
       response.json(result[0]);
    })

})

router.route('/fhs/:id').get((request,response)=>{

    dboperations.getFHS(request.params.id).then(result => {
       response.json(result[0]);
    })

})

router.route('/orders').post((request,response)=>{
    let order = {...request.body}
    dboperations.addOrder(order).then(result => {
        console.log(result)
       response.status(201).json(result);
    })

})

router.route('/delete').delete((request,response)=>{
    let order = {...request.body}
    dboperations.deleteRecord(order).then(result => {
       response.status(201).json(result);
    })

})


var port = process.env.PORT || 8090;
app.listen(port);
console.log('Inventory API is runnning at ' + port);
