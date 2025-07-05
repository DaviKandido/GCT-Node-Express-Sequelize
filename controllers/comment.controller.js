const models = require("../models");
const Validator = require("fastest-validator");


function save(req, res){
    const comment = {
        content: req.body.content,
        postId: req.body.post_id,
        userId: req.body.user_id
    }

    const schema = {
        content: {type: "string", optional: false, max: "500"},
        postId: {type: "number", optional: false},
    }

    const v = new Validator();
    const validationResponse = v.validate(comment, schema)

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation fails!",
            errors: validationResponse
        })
    }

    models.Post.findByPk(req.body.post_id).then(post => {
        if(post === null){
            res.status(404).json({
                message: "Post not found"
            });
        }else{

            models.Comment.create(comment).then(result => {
                res.status(201).json({
                    message: "Created Comment successfully!",
                    comment: {
                            id: result.id, 
                            ...comment
                        }
                })
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong!",
                    error: error
                })
            })

        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    })

}

function index(req, res){
    models.Comment.findAll().then(result => {
        res.status(200).json(result)
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}

function show(req,res){
    const id = req.params.id;

    models.Comment.findByPk(id).then(result => {
        if(result){
            res.status(200).json(result)
        }else{
            res.status(404).json({
                message: "Comment not found!"
           })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}

function update(req, res){
    const id = req.params.id;
    const updateComment = {
        content: req.body.content,
        userId: req.body.user_id
    }

    const schema = {
        content: {type: "string", optional: false, max: "500"},
        userId: {type: "number", optional: false}
    }

    const v = new Validator();
    const validationResponse = v.validate(updateComment, schema)

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation fails!",
            errors: validationResponse
        })
    }

    models.Comment.update(updateComment, {
        where: {
            id: id,
            userId: updateComment.userId
        }
    }).then(result => {
        res.status(201).json({
            message: "Created Comment successfully!",
            comment: {
                    id: Number(id), 
                    ...updateComment
                }
        })
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        })
    })
}

function destroy(req, res){
    const id = req.params.id;

    models.Comment.destroy({
        where: {
            id: id,
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