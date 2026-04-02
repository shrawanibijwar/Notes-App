const express=require('express');
const fs = require("fs");
const app=express();
const path = require("path");


app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    fs.readdir(`./files`, function(err, files) {
        res.render("index", { files: files  }); 
    })
})

app.get('/file/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        res.render('show',{ 
            filename: req.params.filename, 
            filedata: filedata 
        });
    });
});

app.get('/edit/:filename',function(req,res){
    res.render('edit',  { filename: req.params.filename });
})
app.post('/edit', function(req, res) {
    const oldPath = `./files/${req.body.oldname}`;
    const newPath = `./files/${req.body.newname}.txt`;

    fs.rename(oldPath, newPath, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error renaming file");
        }
        res.redirect("/");
    });
});

app.post('/create', function(req, res) {
   
    const content = req.body.details || ""; 
    const title = req.body.title || "untitled";

    const fileName = title.split(' ').join('');

    fs.writeFile(`./files/${fileName}.txt`, content, function(err)  {
        if (err) {
            console.error(err);
            return res.status(500).send("Error saving file");
        }
        res.redirect("/");
    });
});


app.delete('/delete/:filename', function(req, res) {
    const filepath = `./files/${req.params.filename}`;

    fs.unlink(filepath, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log(`Server running on port ${PORT}`);
});