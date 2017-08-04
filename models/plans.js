module.exports = function(sequelize, DataTypes) {
  var Plans = sequelize.define("Plans", {
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

  Plans.associate = function(models) {
    Plans.belongsTo(models.Answers, {
        foreignKey: {
            allowNull: false
        }
    });
  };

  return Plans;
};
