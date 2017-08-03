module.exports = function(sequelize, DataTypes) {
  var Answers = sequelize.define("Answers", {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false
    },
    time: {
      type: DataTypes.STRING, 
      allowNull: false 
    },
    age: {
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    gender: {
      type: DataTypes.STRING, 
      allowNull: false 
    },
    cuisine: {
      type: DataTypes.STRING, 
      allowNull: false 
    },
    price: {
      type: DataTypes.INTEGER, 
      allowNull: false 
    }   
  });

  return Answers;
};
