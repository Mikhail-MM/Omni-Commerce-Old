const uuid4 = require('uuid/v4');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const terminalItems = require('./seed-omni-item-data');
// const omniChildren = require('./seed-omni-employees');

const Users = require('../models/schemas/users');
const OmniUserModel = Users.OmniUser;
const EssosUserModel = Users.EssosUser;


const TerminalSchemas = require('../models/schemas/transaction')
const MenuItemSchema = TerminalSchemas.menuSchema


const storeConfig = require('../models/schemas/storeConfig')
const storeConfigSchema = storeConfig.storeConfigSchema

const MarketplaceModels = require('../models/schemas/marketplace')
const MarketplaceSchema = MarketplaceModels.MarketplaceSchema
const StoreItemModel = MarketplaceModels.StoreItemModel
const ShoppingCartModel = MarketplaceModels.ShoppingCartModel


module.exports.seedOmniUsers = async (req, res, next) => {
	try {
		const savedChildren = [];
		const savedItems = [];

		const seedMongoKey = uuid4().slice(0, 13);
		const hashedPass = await bcrypt.hash('12345', 10);

		const omniChildren = [
			{
				email: 'swasserman@omni.com',

				firstName: 'Sarah',
				lastName: 'Wasserman',
				phone: '(423)-231-5123',

				accountType: 'Child',
				role: 'Hostess',
				isMaster: false,
				isAdmin: false,

				avatarURL: '/assets/seed/omni-avatars/2.jpg',

				mongoCollectionKey: seedMongoKey,
				hash: hashedPass,

				terminalIDNumber: 2,
			},
			{
				email: 'jpalmer@omni.com',

				firstName: 'Jared',
				lastName: 'Palmer',
				phone: '(561)-231-4142',

				accountType: 'Child',
				role: 'Bartender',
				isMaster: false,
				isAdmin: false,

				avatarURL: '/assets/seed/omni-avatars/3.jpg',

				mongoCollectionKey: seedMongoKey,
				hash: hashedPass,

				terminalIDNumber: 3,
			},
			{
				email: 'gwaller@omni.com',

				firstName: 'Gina',
				lastName: 'Waller',
				phone: '(423)-231-5123',

				accountType: 'Child',
				role: 'Waitstaff',
				isMaster: false,
				isAdmin: false,

				avatarURL: '/assets/seed/omni-avatars/4.jpg',

				mongoCollectionKey: seedMongoKey,
				hash: hashedPass,

				terminalIDNumber: 4,
			},
			{
				email: 'fguzman@omni.com',

				firstName: 'Francisco',
				lastName: 'Guzman',
				phone: '(522)-223-1156',

				accountType: 'Child',
				role: 'Sous Chef',
				isMaster: false,
				isAdmin: false,

				avatarURL: '/assets/seed/omni-avatars/5.jpg',

				mongoCollectionKey: seedMongoKey,
				hash: hashedPass,

				terminalIDNumber: 5,
			},
			{
				email: 'tfred@omni.com',

				firstName: 'Theo',
				lastName: 'Friedrich',
				phone: '(987)-513-2222',

				accountType: 'Child',
				role: 'Cook',
				isMaster: false,
				isAdmin: false,

				avatarURL: '/assets/seed/omni-avatars/6.jpg',

				mongoCollectionKey: seedMongoKey,
				hash: hashedPass,

				terminalIDNumber: 6,
			},
			{
				email: 'jfranco@omni.com',

				firstName: 'James',
				lastName: 'Franco',
				phone: '(423)-231-5123',

				accountType: 'Child',
				role: 'Waitstaff',
				isMaster: false,
				isAdmin: false,

				avatarURL: '/assets/seed/omni-avatars/7.jpg',

				mongoCollectionKey: seedMongoKey,
				hash: hashedPass,

				terminalIDNumber: 7,
			},
			{
				email: 'ekim@omni.com',

				firstName: 'Elena',
				lastName: 'Kim',
				phone: '(888)-212-4444',

				accountType: 'Child',
				role: 'Bartender',
				isMaster: false,
				isAdmin: false,

				avatarURL: '/assets/seed/omni-avatars/8.jpg',

				mongoCollectionKey: seedMongoKey,
				hash: hashedPass,

				terminalIDNumber: 8,
			},
]

		
		const omniBossData = {
			email: 'bossman@omni.com',

			firstName: 'Sam',
			lastName: 'Thompson',
			phone: '(416)-931-4104',

			accountType: 'Master',
			role: 'Administrator',
			isMaster: true,
			isAdmin: true,

			avatarURL: '/assets/seed/omni-avatars/1.jpg',

			mongoCollectionKey: seedMongoKey,
			hash: hashedPass,

			terminalIDNumber: 1,

			employeeCounter: omniChildren.length + 2,
		}
		const terminalData = {
			email: `${seedMongoKey}@terminal.com`,
			hash: hashedPass,
			accountType: 'Terminal',
			isAdmin: false,
			isMaster: false,
			terminalIDNumber: 0,
			mongoCollectionKey: seedMongoKey,
		};
		
		const newOmniMaster = new OmniUserModel(omniBossData);
		const newOmniTerminal = new OmniUserModel(terminalData);

		const savedOmniMaster = await newOmniMaster.save();
		const savedOmniTerminal = await newOmniTerminal.save();

		const StoreConfig = mongoose.model('StoreConfig', storeConfigSchema, seedMongoKey + '_StoreConfig');
		
		const newStoreConfig = new StoreConfig({

			mongoKey: seedMongoKey,
			loggedInUsers: ["Terminal"]

		});

		const savedStoreConfig = await newStoreConfig.save();

		// Iterate through employees & seed

		for (let itemData of terminalItems) {
			const ItemModel =  mongoose.model('MenuItem', MenuItemSchema, 'MenuItems_' + seedMongoKey);
			
			const newItemModel = new ItemModel(itemData);
			const savedItem = await newItemModel.save();

			savedItems.push(savedItem);
		}

		for (let employeeData of omniChildren) {
			const newOmniChild = new OmniUserModel(employeeData);

			const savedOmniChild = await newOmniChild.save();

			savedChildren.push(savedOmniChild)
		}

		const response = {
			savedOmniMaster,
			savedOmniTerminal,
			savedStoreConfig,
			savedItems,
			savedChildren,
		}

		res.send(response);

	} catch(err) { next(err) }
}



module.exports.seedEssosMarket = async (req, res, next) => {
	try {

		const savedChildren = [];
		const savedShoppingCarts = [];
		const savedItems = [];

		const hashedPass = await bcrypt.hash('12345', 10);
		const essosSeeds = [
			{
				email: 'aturner@sneakerheadz.com',
				hash: hashedPass,

				firstName: 'Aaron',
				lastName: 'Turner',
				phone: '(411)-789-4131',

				accountType: 'Essos',
				avatarURL: '/assets/seed/essos-avatars/aturner.jpg',
				// dont forget the hash u cucklord


				billing_address_line1: '919 Cedar Grove Rd',
				billing_address_city: 'Wynnewood',
				billing_address_zip: '19096',
				billing_address_state: 'PA',
				shipping_address_line1: '919 Cedar Grove Rd',
				shipping_address_city: 'Wynnewood',
				shipping_address_zip: '19096',
				shipping_address_state: 'PA',
				
				mongoCollectionKey: uuid4().slice(0, 13),

				marketplaceItems: [
					{
						itemName: 'Purple Jordans',
						itemPrice: 120,
						tags: [`Shoes - Male`],
						numberInStock: 1,
						imageURL: '/assets/seed/marketplace/pjordan.jpg',
					},
					{
						itemName: 'Charcoal Adidas',
						itemPrice: 59,
						tags: [`Shoes - Male`],
						numberInStock: 4,
						imageURL: '/assets/seed/marketplace/chadidas.jpg',
					},
					{
						itemName: 'Felt Slip-Ons',
						itemPrice: 39,
						numberInStock: 2,
						tags: [`Shoes - Male`, `Shoes - Female`],
						imageURL: '/assets/seed/marketplace/fslip.jpg'
					},
					{
						itemName: 'Butterfly Boots',
						itemPrice: 60,
						numberInStock: 3, 
						tags: [`Shoes - Female`],
						imageURL: '/assets/seed/marketplace/bboots.jpg',
					},
					{
						itemName: 'Black Yeezys',
						itemPrice: 435,
						numberInStock: 2,
						tags: [`Shoes - Male`, `Shoes - Female`],
						imageURL: '/assets/seed/marketplace/bfeezy.jpg',
					},
					{
						itemName: 'Black Levis',
						itemPrice: 30,
						numberInStock: 10,
						tags: [`Shoes - Male`, `Shoes - Female`],
						imageURL: '/assets/seed/marketplace/blevi.jpg'

					},
					{
						itemName: 'Pink Nike Airs',
						itemPrice: 50,
						numberInStock: 2,
						tags: [`Shoes - Female`],
						imageURL: '/assets/seed/marketplace/pnike.jpg',
					},
					{
						itemName: 'Black Adidas',
						itemPrice: 100,
						numberInStock: 1,
						tags: [`Shoes - Male`],
						imageURL: '/assets/seed/marketplace/badidas.jpg',
					},
					{
						itemName: 'Black Leather Hi-Tops',
						itemPrice: 100,
						numberInStock: 2, 
						tags: [`Shoes - Male`],
						imageURL: '/assets/seed/marketplace/btop.jpg',
					},
					{
						itemName: 'Original Air Jordan 1',
						itemPrice: 570,
						numberInStock: 1,
						tags: [`Shoes - Male`],
						imageURL: '/assets/seed/marketplace/j1.jpg',
					},
					{
						itemName: 'Tribal Canvas Vans',
						itemPrice: 88,
						numberInStock: 1,
						tags: [`Shoes - Male`, `Shoes - Female`],
						imageURL: '/assets/seed/marketplace/tribals.jpg'
					},
					{
						itemName: 'Loafmaster Loafers',
						itemPrice: 90,
						numberInStock: 2,
						tags: [`Shoes - Male`],
						imageURL: '/assets/seed/marketplace/loafman.jpg',
					},
				],
			},
			{
				email: 'pwatch@timepiece.com',
				hash: hashedPass,

				firstName: 'Philippe',
				lastName: 'Arnaud',
				phone: '(551)-412-2312',

				accountType: 'Essos',
				avatarURL: '/assets/seed/essos-avatars/fil.jpg',


				billing_address_line1: '303 Washington St',
				billing_address_city: 'Hempstead',
				billing_address_zip: '11550',
				billing_address_state: 'NY',
				shipping_address_line1: '303 Washington St',
				shipping_address_city: 'Hempstead',
				shipping_address_zip: '11550',
				shipping_address_state: 'NY',
				
				mongoCollectionKey: uuid4().slice(0, 13),

				marketplaceItems: [
					{
						itemName: 'Panerai Luminor Marina',
						itemPrice: 1650,
						numberInStock: 1,
						tags: [`Watches`],
						imageURL: '/assets/seed/marketplace/lumi.jpg',
					},
					{
						itemName: 'Breitling Chronometre Certifie',
						itemPrice: 4162,
						numberInStock: 1,
						tags: [`Watches`],
						imageURL: '/assets/seed/marketplace/bling.jpg',
					},
					{
						itemName: 'Wood-Grain Orient Mako',
						itemPrice: 300,
						numberInStock: 2,
						tags: [`Watches`],
						imageURL: '/assets/seed/marketplace/mako.jpg',
					},
					{
						itemName: 'Sekonda Mens Classic',
						itemPrice: 450,
						numberInStock: 2,
						tags: [`Watches`],
						imageURL: '/assets/seed/marketplace/sekonda.jpg',
					},
				],
			},
			{
				email: 'sb@thred.com',
				hash: hashedPass,

				firstName: 'Sarah',
				lastName: 'Franko',
				phone: '(222)-314-4444',

				accountType: 'Essos',
				avatarURL: '/assets/seed/essos-avatars/sara.jpg',

				billing_address_line1: '553 Washington St',
				billing_address_city: 'Hempstead',
				billing_address_zip: '11550',
				billing_address_state: 'NY',
				shipping_address_line1: '553 Washington St',
				shipping_address_city: 'Hempstead',
				shipping_address_zip: '11550',
				shipping_address_state: 'NY',
				
				mongoCollectionKey: uuid4().slice(0, 13),

				marketplaceItems: [
					{
						itemName: 'Sweater-ish CropTop',
						itemPrice: 39,
						numberInStock: 1,
						tags: [`Apparel - Women's`, `Tops`],
						imageURL: '/assets/seed/marketplace/gcrop.jpg',
					},
					{
						itemName: 'Navy Peacoat',
						itemPrice: 140,
						numberInStock: 1,
						tags: [`Apparel - Women's`, `Tops`],
						imageURL: '/assets/seed/marketplace/bcoat.jpg',
					},
					{
						itemName: 'Shein Bodysuit',
						itemPrice: 40,
						numberInStock: 1,
						tags: [`Apparel - Women's`, `Tops`, `Bottoms`],
						imageURL: '/assets/seed/marketplace/shein.jpg',
					},
					{
						itemName: 'Pink J.Crew Coat',
						itemPrice: 70,
						numberInStock: 1,
						tags: [`Apparel - Women's`, `Tops`],
						imageURL: '/assets/seed/marketplace/pink.jpg',
					},

				],
			},
			{
				email: 'md@beautiful.com',
				hash: hashedPass,

				firstName: 'Monica',
				lastName: 'Bailey',
				phone: '(213)-231-4131',

				accountType: 'Essos',
				avatarURL: '/assets/seed/essos-avatars/sara.jpg',

				billing_address_line1: '600 Washington St',
				billing_address_city: 'Hempstead',
				billing_address_zip: '11550',
				billing_address_state: 'NY',
				shipping_address_line1: '600 Washington St',
				shipping_address_city: 'Hempstead',
				shipping_address_zip: '11550',
				shipping_address_state: 'NY',
				
				mongoCollectionKey: uuid4().slice(0, 13),

				marketplaceItems:[
					{
						itemName:'Marie Veronique Skincare Set',
						itemPrice: 150,
						numberInStock: 1, 
						tags: [`Beauty`],
						imageURL: '/assets/seed/marketplace/mv.jpg',
					},
					{
						itemName: 'Miss Dior Fragrance',
						itemPrice: 50,
						numberInStock: 30,
						tags: [`Beauty`],
						imageURL: '/assets/seed/marketplace/mdior.jpg',
					},
					{
						itemName: 'Makeup Brush Set',
						itemPrice: 29,
						numberInStock: 1,
						tags: [`Beauty`],
						imageURL: '/assets/seed/marketplace/brushset.jpg',
					},
					{
						itemName: 'Chanel No. 5',
						itemPrice: 69,
						numberInStock: 20,
						tags: [`Beauty`],
						imageURL: '/assets/seed/marketplace/chanel.jpg',
					},
					{
						itemName: 'Glossier Blush Kit',
						itemPrice: 40,
						numberInStock: 1, 
						tags: [`Beauty`],
						imageURL: '/assets/seed/marketplace/glossier.jpg',
					},
					{
						itemName: 'Prestige Mens Pomade',
						itemPrice: 29,
						numberInStock: 2,
						tags: [`Beauty`],
						imageURL: '/assets/seed/marketplace/pomade.jpg',		
					},
					{
						itemName: 'Nude By Nature Concealer',
						itemPrice: 15,
						numberInStock: 1,
						tags: [`Beauty`],
						imageURL: '/assets/seed/marketplace/concealer.jpg',
					},
				],	
			},
		]

		for (essosUser of essosSeeds) {
			// Create new User Entry in DB
			const { 
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			} = essosUser

			const userData = {
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			}

			const newEssosUser = new EssosUserModel(userData)
			const savedEssosUser = await newEssosUser.save()

			savedChildren.push(savedEssosUser)
			// Build shopping cart for User

			const newShoppingCart = new ShoppingCartModel({ 
							
				ownerRef_id			: savedEssosUser._id,
				subtotalDisplay		: 0,
				subtotalReal		: 0,
				taxDisplay			: 0,
				taxReal				: 0,
				totalDisplay		: 0,
				totalReal			: 0,
			
			});

			
			const savedShoppingCart = await newShoppingCart.save();

			savedShoppingCarts.push(savedShoppingCart);

			for (item of essosUser.marketplaceItems) {
				const {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL
				} = item

				const itemData = {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL,
					sellerRef_id: savedEssosUser._id,
					postedBy: `${essosUser.firstName} ${essosUser.lastName}`
				}

				const newMarketplaceItem = new StoreItemModel(itemData)
				const savedMarketplaceItem = await newMarketplaceItem.save()

				savedItems.push(savedMarketplaceItem)
			}
		}

		const populateRecommendations = (items) => {

		}

		const generateFollowers = (users) => {

		}

		const generateWishlists = (users, items) => {

		}

		const createFeaturedItems = () => {
			
		}

		const response = {
			savedChildren,
			savedShoppingCarts,
			savedItems
		}

		res.send(response)
		
	} catch(err) { next(err) }
}


const seedFeaturedItems = async (req, res, next) => {
	try {
		
		const savedChildren = [];
		const savedShoppingCarts = [];
		const savedItems = [];

		const hashedPass = await bcrypt.hash('12345', 10);

		const featuredSeed = [{
						email: 'ijones@essos.com',
						hash: hashedPass,
		
						firstName: 'Isis',
						lastName: 'Jones',
						phone: '(423)-789-4131',
		
						accountType: 'Essos',
						avatarURL: '/assets/seed/essos-avatars/isis.jpg',
						billing_address_line1: '919 Cedar Grove Rd',
						billing_address_city: 'Wynnewood',
						billing_address_zip: '19096',
						billing_address_state: 'PA',
						shipping_address_line1: '919 Cedar Grove Rd',
						shipping_address_city: 'Wynnewood',
						shipping_address_zip: '19096',
						shipping_address_state: 'PA',
		
						mongoCollectionKey: uuid4().slice(0, 13),
		
						marketplaceItems: [
							{
								itemName: 'Yellow Blouse',
								itemPrice: 75,
								tags: [`Women`],
								numberInStock: 10,
								imageURL: '/assets/store-splash/featured-1.jpg',
							},
							{
								itemName: 'Floral Blazer',
								itemPrice: 125,
								tags: [`Men`],
								numberInStock: 10,
								imageURL: '/assets/store-splash/featured-1.jpg',
							},
							{
								itemName: 'Blue Flowy Sundress',
								itemPrice: 98,
								tags: [`Women`],
								numberInStock: 10,
								imageURL: '/assets/store-splash/featured-1.jpg',
							},
							{
								itemName: 'Movado Ultra Slim',
								itemPrice: 695,
								tags: [`Men`],
								numberInStock: 10,
								imageURL: '/assets/store-splash/featured-1.jpg',
							},
						],
					}]
			
			const jumbotronSeed = [{
							email: 'bks@essos.com',
							hash: hashedPass,
			
							firstName: 'Brooklyn',
							lastName: 'Supply Co.',
							phone: '(423)-789-4131',
			
							accountType: 'Essos',
							avatarURL: '/assets/seed/essos-avatars/bk.jpg',
			
							billing_address_line1: '919 Cedar Grove Rd',
							billing_address_city: 'Wynnewood',
							billing_address_zip: '19096',
							billing_address_state: 'PA',
							shipping_address_line1: '919 Cedar Grove Rd',
							shipping_address_city: 'Wynnewood',
							shipping_address_zip: '19096',
							shipping_address_state: 'PA',
			
							mongoCollectionKey: uuid4().slice(0, 13),
			
							marketplaceItems: [
								{
									itemName: 'BKSCO Trucker Hat',
									itemPrice: 35,
									tags: [`Men`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbo1.jpg',
								},
								{
									itemName: 'Paradise Graphic Tee',
									itemPrice: 40,
									tags: [`Men`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbo2.jpg',
								},
								{
									itemName: 'Herschel Supply Co. Backpack',
									itemPrice: 80,
									tags: [`Men`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbo3.jpeg',
								},
								{
									itemName: 'Gray Canvas Mid-Calf Socks',
									itemPrice: 20,
									tags: [`Men`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbo4.jpg',
								},
								{
									itemName: 'True Religion Rocco Skinny Jeans',
									itemPrice: 90,
									tags: [`Men`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbo5.jpg',
								},
								{
									itemName: 'Nike Air Max 2',
									itemPrice: 90,
									tags: [`Men`],
									numberInStock: 10,
									imageURL: '/assets/store-splash/jumbo6.jpg',
								},
							],
						}]

			for (essosUser of featuredSeed) {
			// Create new User Entry in DB
			const { 
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			} = essosUser

			const userData = {
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			}

			const newEssosUser = new EssosUserModel(userData)
			const savedEssosUser = await newEssosUser.save()

			savedChildren.push(savedEssosUser)

			const newShoppingCart = new ShoppingCartModel({ 
							
				ownerRef_id			: savedEssosUser._id,
				subtotalDisplay		: 0,
				subtotalReal		: 0,
				taxDisplay			: 0,
				taxReal				: 0,
				totalDisplay		: 0,
				totalReal			: 0,
			
			});

			
			const savedShoppingCart = await newShoppingCart.save();

			savedShoppingCarts.push(savedShoppingCart);

			for (item of essosUser.marketplaceItems) {


				const {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL
				} = item

				const itemData = {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL,
					sellerRef_id: savedEssosUser._id,
					postedBy: `${essosUser.firstName} ${essosUser.lastName}`
				}
				const featuredItemModel = mongoose.model('Marketplace', marketplaceSchema, 'storeitems_featured');
				const newMarketplaceItem = new featuredItemModel(itemData)
				const savedMarketplaceItem = await newMarketplaceItem.save()

				savedItems.push(savedMarketplaceItem)
			}
		}

		for (essosUser of jumbotronSeed) {
			// Create new User Entry in DB
			const { 
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			} = essosUser

			const userData = {
				email, 
				hash, 
				accountType, 
				firstName, 
				lastName, 
				phone, 
				avatarURL,
				billing_address_line1,
				billing_address_line2,
				billing_address_city,
				billing_address_zip,
				billing_address_state,
				shipping_address_line1,
				shipping_address_line2,
				shipping_address_city,
				shipping_address_zip,
				shipping_address_state,
				mongoCollectionKey,
			}

			const newEssosUser = new EssosUserModel(userData)
			const savedEssosUser = await newEssosUser.save()

			savedChildren.push(savedEssosUser)

			const newShoppingCart = new ShoppingCartModel({ 
							
				ownerRef_id			: savedEssosUser._id,
				subtotalDisplay		: 0,
				subtotalReal		: 0,
				taxDisplay			: 0,
				taxReal				: 0,
				totalDisplay		: 0,
				totalReal			: 0,
			
			});

			
			const savedShoppingCart = await newShoppingCart.save();

			savedShoppingCarts.push(savedShoppingCart);

			for (item of essosUser.marketplaceItems) {


				const {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL
				} = item

				const itemData = {
					itemName,
					itemPrice,
					numberInStock,
					tags,
					imageURL,
					sellerRef_id: savedEssosUser._id,
					postedBy: `${essosUser.firstName} ${essosUser.lastName}`
				}
				const jumbotronItemModel = mongoose.model('Marketplace', marketplaceSchema, 'storeitems_banner');
				const newMarketplaceItem = new jumbotronItemModel(itemData)
				const savedMarketplaceItem = await newMarketplaceItem.save()

				savedItems.push(savedMarketplaceItem)
			}
		}

		const response = {
			savedChildren,
			savedShoppingCarts,
			savedItems
		}

		res.send(response)

	} catch(err) { next(err) }
}