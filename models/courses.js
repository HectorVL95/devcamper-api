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
  },
    user: {
    type: mongoose.Schema.ObjectId,    
    ref: 'user',
    required: true
  }
});

// 🧮 Static method to calculate average tuition for a bootcamp
course_model.statics.get_average_cost = async function (bootcamp_id) {
  console.log('Calculating average cost...'.blue);

  // Perform aggregation to get the total average tuition
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcamp_id } },
    { $group: { _id: '$bootcamp', average_cost: { $avg: '$tuition' } } }
  ]);

  console.log('Aggregation result:', obj);

  try {
    if (obj.length > 0) {
      // Round the average to the nearest 10
      await this.model('Bootcamp').findByIdAndUpdate(bootcamp_id, {
        average_cost: Math.ceil(obj[0].average_cost / 10) * 10
      });
      console.log('Bootcamp updated with new average_cost:', obj[0].average_cost);
    } else {
      console.log('No courses found for bootcamp:', bootcamp_id);
    }
  } catch (err) {
    console.error('Error updating average cost:', err);
  }
};


// 🟢 Post middleware for createOne (after creation)
course_model.post('createOne', async function (doc, next) {
  console.log(`Course created: ${doc.title}`);
  try {
    if (doc.bootcamp) {
      await this.model.get_average_cost(doc.bootcamp);
    }
  } catch (err) {
    console.error('Error updating average cost after create:', err);
  }
  next();
});

// 🔴 Pre middleware for deleteOne (before deletion)
course_model.pre('deleteOne', { document: false, query: true }, async function (next) {
  const bootcamp_id = this.getFilter().bootcamp;
  console.log(`Attempting to update average cost for bootcamp ${bootcamp_id} before course deletion`);

  try {
    const doc = await this.model.findOne(this.getFilter());
    if (doc && doc.bootcamp) {
      await this.model.get_average_cost(doc.bootcamp);
    }
  } catch (err) {
    console.error('Error updating average cost before delete:', err);
  }

  next();
});

export default model('Course', course_model);