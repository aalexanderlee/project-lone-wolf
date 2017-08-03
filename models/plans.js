module.exports = function(sequelize, DataTypes) {
  var Plans = sequelize.define("Plans", {
    user_id: {
      type: DataTypes.INTEGER, 
      allowNull: false 
    }, 
    match_id: {
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
    cuisine: {
      type: DataTypes.STRING, 
      allowNull: false 
    },
    price: {
      type: DataTypes.INTEGER, 
      allowNull: false 
    }   
  });

  return Plans;
};
