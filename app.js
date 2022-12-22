const express = require("express")
const body_parser = require("body-parser") 
const mongoose = require("mongoose")
const { Template } = require("ejs")
const app = express()
const router = express.Router()

var items = []
var workitem = []
app.set("view engine","ejs")
app.use(body_parser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true})

const itemsSchema = {
    name:String
}

const Item = mongoose.model("Item",itemsSchema)

const item1 = new Item({
    name:"welcome your todolist"
})

const item2 = new Item({
    name:"Hit the + button to aff a new item"
})

const item3 = new Item({
    name:"<-- Hit this delete item"
})

const defaultItems = [item1,item2,item3]



app.get("/",function(req,res){ 
    var today = new Date(); 
    var options = {
        weekday : "long",
        day: "numeric",
        month: "long"
    }
    var day = today.toLocaleDateString("en-us",options)
    Item.find({},function(err,foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log("err")
                }
                else{
                    console.log("success") 
                }
            })
            res.redirect("/")
        }
        else{
            res.render("list",{listTitle:day,newlistItem:foundItems})
        }
        
    })
    
})
app.get("/work",function(req,res){
    res.render("list",{listTitle : "work list",newlistItem:workitem})
})
// app.post("/work",function(req,res){
//     let item = req.body.newItem
//     workitem.push(item)
//     res.redirect("/work")
// })
app.post("/",function(req,res){
    var itemName = req.body.newItem
    // if (req.body.list ==="work"){
    //     workitem.push(item)
    //     res.redirect("/work")
    // }
    // else{
    //     items.push(item)
    //     res.redirect("/")
    // }
    const item = new Item ({
        name:itemName
    })
    item.save()
    res.redirect("/")
    
    
})

app.post("/delete",function(req,res){
    const checkItemId = req.body.checkbox
    Item.findByIdAndRemove(checkItemId,function(err){
        if(!err){
            // console.log("ok")
            res.redirect("/")
        }
        
    })
})

app.listen(3000,function(){
    console.log("server is runing")
})