const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  major:    { type: String, default: '' },
  year:     { type: Number, default: 1 },
  avatarUrl:{ type: String, default: '' },
  bio:      { type: String, default: '' },
  enrolledCourseIds: [{ type: String }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate avatar initials from name
userSchema.pre('save', function(next) {
  if (!this.avatarUrl || this.avatarUrl === '') {
    const parts = this.name.split(' ');
    this.avatarUrl = parts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
  }
  next();
});

userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    major: this.major,
    year: this.year,
    avatarUrl: this.avatarUrl,
    bio: this.bio,
    enrolledCourseIds: this.enrolledCourseIds,
  };
};

module.exports = mongoose.model('User', userSchema);
