const { Schema, default: mongoose } = require("mongoose");

const TripSchema = new Schema({
  tripID: {
    type: Number,
  },
  tripName: {
    type: String,
    require: true,
  },
  users: [String],
  budgetTotal: {
    type: Number,
    default: 0,
  },
});

const Trip = mongoose.model("trips", TripSchema);
module.exports = Trip;
