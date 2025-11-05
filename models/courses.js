import mongoose, { Schema, model } from 'mongoose';

const course_model = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add a number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimum_skill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarship_available: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,    
    ref: 'Bootcamp',
    required: true
  }
})

//Static method to get average of course tuitions
course_model.statics.get_average_cost = async function(bootcamp_id) {
  console.log('Calculating average cost...'.blue)

  const obj = await this.aggregate([
    {
      $match: {
        bootcamp: bootcamp_id
      },
      $group: {
        _id: '$bootcamp',
        average_cost: { $avg: '$tuition' } 
      }
    }
  ])

  console.log(obj);
}

//Get average cost after save
course_model.post('createOne', function () {
  this.constructor.get_average_cost(this.bootcamps)
})

//Get average cost before remove
course_model.pre('deleteOne', function () {
  this.constructor.get_average_cost(this.bootcamps)
})


export default model('Course', course_model)