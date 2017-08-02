module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define("user", {
		first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		birthday: {
			type: DataTypes.DATE,
			allowNull: false, 
			validate: {
				isDate: true
			}
		},
		image_url: {
			type: DataTypes.STRING,
			allowNull: false, 
			validate: {
				isUrl: true
			}
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false, 
			validate: {
				isEmail: true
			}
		}
		// password: {
			// type: DataTypes.VIRTUAL
			// set: function(val) {
			// 	this.setDataValue("password", val);
			// 	this.setDataValue("password_hash", this.salt + val);
			// },
			// validate: {
			// 	isLongEnough: function(val) {
			// 		if (val.length < 7) {
			// 			throw new Error("Please choose a longer password");
			// 		}
			// 	}
			// }
		// },
		// password_hash: {
		// 	type: DataTypes.STRING
		// }
	});
	return user;
};