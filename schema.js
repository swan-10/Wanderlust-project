const Joi = require("joi");
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(1),
        // image: Joi.string().allow("",null),
        image: Joi.object({
            url: Joi.string().allow('', null), // Adjust based on your requirements
            filename: Joi.string().allow('', null), // Adjust based on your requirements
        }),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
})