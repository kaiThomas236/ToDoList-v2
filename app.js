const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const day = require(__dirname + "/date.js").getDate();

const app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB");



const itemsSchema = new mongoose.Schema({
    name: String,
    checked: Boolean
});

const Items = mongoose.model("Item", itemsSchema);
const WorkItems = mongoose.model("WorkItem", itemsSchema);

const item1 = new Items ({
    name: "Welcome to your ToDo list.",
    checked: false
});

const item2 = new Items ({
    name: "Hit the + button to add a new item.",
    checked: false
});

const item3 = new Items ({
    name: "Hit the checkbox to mark an item as completed.",
    checked: false
});

const item4 = new Items({
    name: "Hit the x button to remove an item from the list.",
    checked: false
});

const defaultItems = [item1, item2, item3, item4];


const workItem1 = new WorkItems({
    name: "Welcome to your Work ToDo list.",
    checked: false
});

const workItem2 = new WorkItems({
    name: "Hit the + button to add a new item.",
    checked: false
});

const workItem3 = new WorkItems({
    name: "Hit the checkbox to mark an item as completed.",
    checked: false
});

const workItem4 = new WorkItems({
    name: "Hit the x button to remove an item from the list.",
    checked: false
});


const workDefaultItems = [workItem1, workItem2, workItem3, workItem4];




app.get("/", function (req, res) {

    Items.find({}, function (err, itemsList) {
        
        if (itemsList.length === 0) { 
            Items.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Saved all the default tasks.");
                };
            });
            res.redirect("/");
        } else {
            res.render('list', { day: day, subtitle: "To Do List", newItems: itemsList });
        };
    });    
    
    
});

app.get("/work", function (req, res) {

    WorkItems.find({}, function (err, workItemsList) {
        // console.log(workItemsList)
        if (workItemsList.length === 0) {
            WorkItems.insertMany(workDefaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Saved all the default work tasks.");
                };
            });
            res.redirect("/work");
        } else {
            res.render('list', { day: day, subtitle: "Work To Do List", newItems: workItemsList });
        };
    });
});


app.post("/additem", function(req, res){
    // console.log("add item title:", req.body.title);
    // console.log("add item:", req.body.newItem);
    if (req.body.title === "Work To Do List") {
        const item = new WorkItems ({
            name: req.body.newItem
        });
        item.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Inserted one work item.");
            };
        });
        res.redirect("/work");
    } else {
        const item = new Items({
            name: req.body.newItem
        });
        item.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Inserted one item.");
            };
        });
        res.redirect("/");
    };
});

app.post("/delitem", function(req, res){
    const temp = req.body.delItem.split("|");
    const item = temp[0];
    const title = temp[1];
    if (title === "Work To Do List") {
        WorkItems.deleteOne({ name: item }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Deleted one work item.");
            };
        });
        res.redirect("/work");
    } else {
        Items.deleteOne({ name: item }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Deleted one item.");
            };
        });
        res.redirect("/");
    };
});

app.post("/checkItem", function(req, res) {
    var item;
    var title;
    if (typeof req.body.checkItem === 'object') {  // checking the item
        item = req.body.checkItem[0].split("|")[0];
        title = req.body.checkItem[0].split("|")[1];
        if (title === "Work To Do List") {
            WorkItems.updateOne({ name: item }, { checked: true }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Checked one work item.");
                };
            });
            res.redirect("/work");
        } else {
            Items.updateOne({ name: item }, { checked: true }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Checked one item.");
                };
            });
            res.redirect("/");
        };
    } else if (typeof req.body.checkItem === 'string') { // unchecking the item
        item = req.body.checkItem.split("|")[0];
        title = req.body.checkItem.split("|")[1];

        if (title === "Work To Do List") {
            WorkItems.updateOne({ name: item }, { checked: false }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Checked one work item.");
                };
            });
            res.redirect("/work");
        } else {
            Items.updateOne({ name: item }, { checked: false }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Checked one item.");
                };
            });
            res.redirect("/");
        };
    };
    
    
 
    
    if (title === "Work To Do List") {
        WorkItems.updateOne({ name: item }, {checked: true}, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Checked one work item.");
            };
        });
        res.redirect("/work");
    } else if (title === "To Do List") {
        Items.updateOne({ name: item }, { checked: true }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Checked one item.");
            };
        });
        res.redirect("/");
    } else {
        console.log("kys", req.body.checkItem, req.body);
    };
});


app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server is running on port 3000!");
});