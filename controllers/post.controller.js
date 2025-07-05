const models = require("../models") 
const Validator = require("fastest-validator")

// era padrão que o user_id sempre fosse 1, alterei para ser dinamico
function save (req, res) {
   const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.image_url,
        categoryId: req.body.category_id,
        userId: req.userData.userId
   }

    const schema = {
        title: {type: "string", optional: false, max: "100"},
        content: {type: "string", optional: false, max: "500"},
        categoryId: {type: "number", optional: false}
    }

    const v = new Validator();
    const validationResponse = v.validate(post, schema)

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation fails!",
            errors: validationResponse
        })
    }

    models.Category.findByPk(req.body.category_id).then(result =>{
        if(result !== null){
             models.Post.create(post).then(result => {
                res.status(201).json({
                    message: "Created Post successfully!",
                    post: {
                        id: result.id, 
                        ...post
                        }
                })
            }).catch(error => {
                    res.status(500).json({
                        message: "Something went wrong!",
                        error: error
                    })
            })
        }else{
            res.status(404).json({
                message: "Invalid Category ID"
            })
        }
    });

  
}

function index(req, res){
    models.Post.findAll().then(result => {
        res.status(200).json(result)
    }).catch(error => {
        res.send(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}


function show(req, res){
    const id = req.params.id;

    models.Post.findByPk(id, {
        include: [models.User, models.Category,]
    }).then(result => {
        if(result){
            res.status(200).json(result)
        }else{
            res.status(404).json({
                message: "Post not found!"
           })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}

function update(req,res){
    const id = req.params.id;
    const updatePost = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.image_url,
        categoryId: req.body.category_id,
        userId: req.userData.userId
    }

    const schema = {
        title: {type: "string", optional: false, max: "100"},
        content: {type: "string", optional: false, max: "500"},
        categoryId: {type: "number", optional: false}
    }

    const v = new Validator();
    const validationResponse = v.validate(updatePost, schema)

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation fails!",
            errors: validationResponse
        })
    }

    
    models.Category.findByPk(req.body.category_id).then(result =>{
        if(result !== null){
            models.Post.update(updatePost, {
                where: {
                    id: id,
                    userId: updatePost.userId
                }
            }).then(result => {
                res.status(200).json({
                    menssage: "Updated Post successfully!",
                    post: {
                            id: Number(id),
                            ...updatePost
                        }
                })
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong!",
                    error: error
                })
            })
        }else{
            res.status(404).json({
                message: "Invalid Category ID"
            })
        }
    });


}

function destroy(req, res){
    const id = req.params.id;
    const userId = req.userData.userId

    models.Post.destroy({
        where: {
            id: id,
            userId: userId
        }
    }).then(result => {
        res.status(200).json({
            message: "Deleted Post successfully!"
        })
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}

module.exports = {
    save: save,
    show: show,
    index: index,
    update: update,
    destroy: destroy
}