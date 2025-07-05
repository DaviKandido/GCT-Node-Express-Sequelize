const models = require('../models');

async function test(req, res){

    //One to one - 1:1 - a user has one address, or an address belongs (pertence) to only one user
    //One to may - 1:N - a user has many posts, or an address belongs (pertence) to many users
    //Many to many - M:N - a post belongs (pertence) to many categories


    //one to one
    const user = await models.User.findByPk(1, {
        include: [models.Address]
    });

    const adress = await models.Address.findByPk(1, {
        include: [models.User]
    })

    //One to many
    // const user = await models.User.findByPk(1, {
    //     include: [models.Post]
    // });

    //Many to many
    const post = await models.Post.findByPk(1, {
        include: [models.Category]
    })

    const Category = await models.Category.findByPk(1, {
        include: [models.Post]
    })

    const Comment = await models.Comment.findByPk(1, {
        include: [models.Post, models.User]
    })

    res.status(200).json({
        data: Comment
    });
}

module.exports = {
    test:test
}