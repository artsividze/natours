// review / rating / createdAt / ref to tour /ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, 'review can not be empty!']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to  user']
    }
  },

  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// reviewSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'user',
//     select: 'name'
//   });
// });
// reviewSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'tour',
//     select: 'name photo'
//   });
// });
reviewSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path: 'user',
  //     select: 'name'
  //   }).populate({
  //     path: 'tour',
  //     select: 'name photo'
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.post(/^findOneAnd/, async function(next) {
  //await this.findOne (); does not work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post('save', function() {
  //this points to current review
  this.constructor.calcAverageRatings(this.tour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
