const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

let Review;
// Function to dynamically import the Review model
const importReviewModel = () => {
  if (!Review) {
    Review = require("./review.js");
  }
  return Review;
};

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    // image: {
    //     type: Schema.Types.Mixed,
    //     default: {
    //       filename: 'default-image',
    //       url: 'https://images7.alphacoders.com/946/946286.png',
    //     },
    //     set: (v) => {
    //       if (!v || typeof v === 'string') {
    //         // If it's a string or empty, return an object with the default values
    //         return {
    //           filename: 'default-image',
    //           url: v || 'https://images7.alphacoders.com/946/946286.png',
    //         };
    //       }
    //       // If it's already an object, return it as is
    //       return v;
    //     },
    // },
    image: {
      url: String,
      filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: "Review"
    }],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
});



listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing){
    const Review = importReviewModel();
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;