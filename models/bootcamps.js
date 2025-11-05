import mongoose, { Schema, model } from 'mongoose';
import slugify from 'slugify';
import { geocoder } from '../utils/geocode.js';

const bootcamp_model = new Schema({
  name: {
    type: String,
    required: [
      true,
      'Please add a name '
    ]
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  website: {
    type: String,
    match: [
    /\b((https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?([\/\w\-\.\?\=\#\&\%]*)?)\b/,
    'Please use a valid URL with HTTP or HTTPS'
  ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 digits']
  },
  email: {
    type: String,
    match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email' ]
  },
  address: {
    type: String,
    required: [true, 'Please an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
      index: '2dsphere'
    },
    formatted_address: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other'
    ]
  },
  average_rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating can not be more than 10']
  },
  average_cost: {
    type: Number,
    required: false
  },
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  job_assistance: {
    type: Boolean,
    default: false
  },
  job_guarantee: {
    type: Boolean,
    default: false
  },
  accept_gi: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

bootcamp_model.pre('save', function (next) { 
  this.slug = slugify(this.name, { lower: true })
  next()
});

bootcamp_model.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address)
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formatted_address: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  }

  this.address = undefined;
  next()
})

//Cascade delete courses when a bootcamp is deleted
bootcamp_model.pre('deleteOne', {query: false, document: true} , async function(next) {
  console.log(`Courses being removed from bootcamp ${this._id}`)
  await this.model('Course').deleteMany({ bootcamp: this._id })

  next();
})

bootcamp_model.virtual('courses', { 
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
 })

export default model('Bootcamp', bootcamp_model)