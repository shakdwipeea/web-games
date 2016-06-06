/**
 * Each Spell is a object containing the folllowing
 * 
 * name String name of the spell
 * 
 * req  Object Conatins the requirements to perform the spell
 * 	mana   Mana required 
 * 	health Health required
 *
 * damage_oth Object Damage done by the spell to others
 * 	  mana Mana reduced of opponent
 * 	  health Health reduced of opponent
 *
 * damage_self Object Damage done by spell to self
 * 	       mana Mana reduced due to spell
 * 	       health Health reduced due to spell
 * 
 * extra Function extra ability of any spell to do damage to others
 * 		of the form (Mana, health) => {
 *			mana: {
 *				effect: Boolean Affected by the spell
 *				value: new value
 *				timeout: duration of new value
 *			},
 *			health: {
 *				effect: Boolean Affected by the spell
 *				value: new value
 *				timeout: duration of new value	
 *			}
 * 		}
 * */
var Spells = {
	expelliarmus: {
		name: "Expelliarmus",
		req: {
			mana: 40,
			health: 10
		},
		damage_oth: {
			mana: 5,
			health: 20
		},
		damage_self: {
			mana: 3,
			health: 0
		},
		extra: function (mana, health) {
			return {
				mana: {
					effect: true,
					value: 0,
					timeout: 20
				},
				health: {
					effect: false
				}
			}
		}
	},
	abracadabra: {
		name: "Abracadabra",
		req: {
			mana: 300,
			health: 200
		},
		damage_oth: {
			mana: 40,
			health: 600
		},
		damage_self: {
			mana: 400,
			health: 0
		},
		extra: function (mana, health) {
			return {
				mana: {
					effect: false
				},
				health: {
					effect: false
				}
			}
		}
	}
}
