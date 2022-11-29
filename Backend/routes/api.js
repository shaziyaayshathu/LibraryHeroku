const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')
const libraryData=require('../models/library')
const userData=require('../models/user')

function verifyToken(req,res,next)
{
    if(!req.headers.authorization)
    {
        return res.status(401).send('Unauthorized request')
    }
    let token=req.headers.authorization.split(' ')[1]
    if(token==null)
    {
        return res.status(401).send('Unauthorized request')
    }
    let payload=jwt.verify(token,'secretkey')
    console.log(payload)
    if(!payload)
    {
        return res.status(401).send('Unauthorized request') 
    }
    req.username=payload.subject
    next()

}

router.post('/login', (req,res)=>{
   
        let item=req.body
        if(item.username==' ' )
        {
            return res.status(401).json({
                message: 'Username cannot be empty !'
            });  
        }
        console.log(req.body)
       userData.findOne({username:item.username}).then(user=>{
        if (!user) {
            return res.status(401).json({
                message: 'User not found !'
            });
          }
        console.log(user.username)
        console.log(user.password)
        // if(item.username != user.username)
        // {
        // return res.status(401).json({
        //     error: new Error('User not found!')
        //   });
        // }
         if(item.password != user.password)
        {
            return res.status(401).json({
                message: 'Invalid login credentials !'
              });  
        }
        else
        {
            let payload={subject:user.username+user.password}
            let token=jwt.sign(payload,'secretkey')
            res.status(200).send({token});
        }
        
    } ).catch (
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );

})

router.post('/register', (req,res)=>{
    try {
        let item={
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.email,
        password: req.body.password
        }
        console.log(item)
        const newUser=new userData(item)
        newUser.save((error,data)=>{
            if(error)
            {
                res.json({"status":"error"})
            }
            else{
                res.json({"status":"success","data":data})
            }
        })
        //res.send(saveUser)
        
    } catch (error) {
        console.log(error)
        
    }

})
router.get('/booklist',async (req,res)=>{
   try {
    const list=await libraryData.find()
    res.send(list);
    
   } catch (error) {
    
    console.log(error)
   }
    
})
router.get('/book/:id',async (req,res)=>{
    try { 
        let id=req.params.id
        const getSingleBook=await libraryData.findById(id)
        res.send(getSingleBook);
        
    } catch (error) {
        console.log(error)
        
    }
    
})
router.post('/book',verifyToken,async (req,res)=>{
    try {
        let item=req.body
        console.log(item)
        const newBook=new libraryData(item)
        const saveBook=await newBook.save()
        res.send(saveBook)
        
    } catch (error) {
        console.log(error)
        
    }

})
router.put('/book/:id',async (req,res)=>{
    try {
        let id=req.params.id
        let item={
            title:req.body.title,
            author:req.body.author,
            publication:req.body.publication,
            noPages:req.body.noPages
        }
        let update={
            $set:item
        }
        const updateBook=await libraryData.findByIdAndUpdate({'_id':id},update)
        res.send(updateBook)
        
    } catch (error) {
        console.log(error)
        
    }

})
router.delete('/book/:id',async (req,res)=>{
    try {
        let id=req.params.id
        const deleteBook= await libraryData.findByIdAndDelete(id)
        res.send(deleteBook)
    } catch (error) {
        console.log(error)
        
    }
    
})

module.exports=router

