import type { Product, Category } from './types';

export const categories: Category[] = [
  { id: 'rice-grains', name: 'Rice & Grains', nameTelugu: 'బియ్యం & ధాన్యాలు', icon: 'grain', order: 1 },
  { id: 'pulses-dal', name: 'Pulses & Dal', nameTelugu: 'పప్పులు & కందులు', icon: 'beans', order: 2 },
  { id: 'spices', name: 'Spices & Masala', nameTelugu: 'మసాలాలు', icon: 'pepper', order: 3 },
  { id: 'oils', name: 'Cooking Oils', nameTelugu: 'వంట నూనెలు', icon: 'droplet', order: 4 },
  { id: 'flour', name: 'Flour & Atta', nameTelugu: 'పిండి & ఆటా', icon: 'wheat', order: 5 },
  { id: 'sugar-salt', name: 'Sugar & Salt', nameTelugu: 'చక్కెర & ఉప్పు', icon: 'cube', order: 6 },
  { id: 'tea-coffee', name: 'Tea & Coffee', nameTelugu: 'టీ & కాఫీ', icon: 'coffee', order: 7 },
  { id: 'snacks', name: 'Snacks & Biscuits', nameTelugu: 'స్నాక్స్ & బిస్కెట్లు', icon: 'cookie', order: 8 },
  { id: 'dairy', name: 'Dairy Products', nameTelugu: 'పాల ఉత్పత్తులు', icon: 'milk', order: 9 },
  { id: 'personal-care', name: 'Personal Care', nameTelugu: 'వ్యక్తిగత సంరక్షణ', icon: 'sparkles', order: 10 },
  { id: 'cleaning', name: 'Cleaning & Household', nameTelugu: 'శుభ్రత & గృహ సామాగ్రి', icon: 'spray', order: 11 },
  { id: 'pooja', name: 'Pooja Items', nameTelugu: 'పూజా సామాగ్రి', icon: 'flame', order: 12 },
]

export const initialProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Rice & Grains
  { name: 'Sona Masoori Rice', nameTelugu: 'సోనా మసూరి బియ్యం', category: 'rice-grains', basePrice: 60, unit: 'kg', image: '/images/products/sona-masoori.jpg', inStock: true, description: 'Premium quality Sona Masoori rice' },
  { name: 'Basmati Rice', nameTelugu: 'బాస్మతి బియ్యం', category: 'rice-grains', basePrice: 120, unit: 'kg', image: '/images/products/basmati-rice.jpg', inStock: true, description: 'Long grain aromatic basmati rice' },
  { name: 'Raw Rice', nameTelugu: 'పచ్చి బియ్యం', category: 'rice-grains', basePrice: 50, unit: 'kg', image: '/images/products/raw-rice.jpg', inStock: true, description: 'Traditional raw rice for idli and dosa' },
  { name: 'Broken Rice', nameTelugu: 'నూకలు', category: 'rice-grains', basePrice: 40, unit: 'kg', image: '/images/products/broken-rice.jpg', inStock: true, description: 'Broken rice pieces' },
  { name: 'Wheat', nameTelugu: 'గోధుమలు', category: 'rice-grains', basePrice: 45, unit: 'kg', image: '/images/products/wheat.jpg', inStock: true, description: 'Whole wheat grains' },
  { name: 'Jowar', nameTelugu: 'జొన్నలు', category: 'rice-grains', basePrice: 55, unit: 'kg', image: '/images/products/jowar.jpg', inStock: true, description: 'Sorghum millet' },
  { name: 'Ragi', nameTelugu: 'రాగులు', category: 'rice-grains', basePrice: 65, unit: 'kg', image: '/images/products/ragi.jpg', inStock: true, description: 'Finger millet' },
  
  // Pulses & Dal
  { name: 'Toor Dal', nameTelugu: 'కందిపప్పు', category: 'pulses-dal', basePrice: 140, unit: 'kg', image: '/images/products/toor-dal.jpg', inStock: true, description: 'Split pigeon peas' },
  { name: 'Chana Dal', nameTelugu: 'శనగపప్పు', category: 'pulses-dal', basePrice: 90, unit: 'kg', image: '/images/products/chana-dal.jpg', inStock: true, description: 'Split chickpeas' },
  { name: 'Moong Dal', nameTelugu: 'పెసరపప్పు', category: 'pulses-dal', basePrice: 130, unit: 'kg', image: '/images/products/moong-dal.jpg', inStock: true, description: 'Split green gram' },
  { name: 'Urad Dal', nameTelugu: 'మినపప్పు', category: 'pulses-dal', basePrice: 150, unit: 'kg', image: '/images/products/urad-dal.jpg', inStock: true, description: 'Split black gram' },
  { name: 'Masoor Dal', nameTelugu: 'మసూర్ పప్పు', category: 'pulses-dal', basePrice: 100, unit: 'kg', image: '/images/products/masoor-dal.jpg', inStock: true, description: 'Red lentils' },
  { name: 'Rajma', nameTelugu: 'రాజ్మా', category: 'pulses-dal', basePrice: 160, unit: 'kg', image: '/images/products/rajma.jpg', inStock: true, description: 'Kidney beans' },
  { name: 'Black Chana', nameTelugu: 'నల్ల శనగలు', category: 'pulses-dal', basePrice: 85, unit: 'kg', image: '/images/products/black-chana.jpg', inStock: true, description: 'Black chickpeas' },
  
  // Spices
  { name: 'Turmeric Powder', nameTelugu: 'పసుపు', category: 'spices', basePrice: 180, unit: 'kg', image: '/images/products/turmeric.jpg', inStock: true, description: 'Pure turmeric powder' },
  { name: 'Red Chilli Powder', nameTelugu: 'ఎర్ర మిర్చి పొడి', category: 'spices', basePrice: 200, unit: 'kg', image: '/images/products/red-chilli.jpg', inStock: true, description: 'Spicy red chilli powder' },
  { name: 'Coriander Powder', nameTelugu: 'ధనియాల పొడి', category: 'spices', basePrice: 160, unit: 'kg', image: '/images/products/coriander-powder.jpg', inStock: true, description: 'Fresh coriander powder' },
  { name: 'Cumin Seeds', nameTelugu: 'జీలకర్ర', category: 'spices', basePrice: 280, unit: 'kg', image: '/images/products/cumin.jpg', inStock: true, description: 'Whole cumin seeds' },
  { name: 'Mustard Seeds', nameTelugu: 'ఆవాలు', category: 'spices', basePrice: 120, unit: 'kg', image: '/images/products/mustard.jpg', inStock: true, description: 'Black mustard seeds' },
  { name: 'Garam Masala', nameTelugu: 'గరం మసాలా', category: 'spices', basePrice: 350, unit: 'kg', image: '/images/products/garam-masala.jpg', inStock: true, description: 'Blend of aromatic spices' },
  { name: 'Sambar Powder', nameTelugu: 'సాంబార్ పొడి', category: 'spices', basePrice: 220, unit: 'kg', image: '/images/products/sambar-powder.jpg', inStock: true, description: 'Traditional sambar masala' },
  { name: 'Rasam Powder', nameTelugu: 'రసం పొడి', category: 'spices', basePrice: 200, unit: 'kg', image: '/images/products/rasam-powder.jpg', inStock: true, description: 'Tangy rasam spice mix' },
  
  // Cooking Oils
  { name: 'Sunflower Oil', nameTelugu: 'పొద్దు తిరుగుడు నూనె', category: 'oils', basePrice: 140, unit: 'litre', image: '/images/products/sunflower-oil.jpg', inStock: true, description: 'Refined sunflower oil' },
  { name: 'Groundnut Oil', nameTelugu: 'వేరుశనగ నూనె', category: 'oils', basePrice: 180, unit: 'litre', image: '/images/products/groundnut-oil.jpg', inStock: true, description: 'Cold pressed groundnut oil' },
  { name: 'Coconut Oil', nameTelugu: 'కొబ్బరి నూనె', category: 'oils', basePrice: 200, unit: 'litre', image: '/images/products/coconut-oil.jpg', inStock: true, description: 'Pure coconut oil' },
  { name: 'Sesame Oil', nameTelugu: 'నువ్వుల నూనె', category: 'oils', basePrice: 350, unit: 'litre', image: '/images/products/sesame-oil.jpg', inStock: true, description: 'Traditional gingelly oil' },
  { name: 'Mustard Oil', nameTelugu: 'ఆవ నూనె', category: 'oils', basePrice: 160, unit: 'litre', image: '/images/products/mustard-oil.jpg', inStock: true, description: 'Pungent mustard oil' },
  
  // Flour & Atta
  { name: 'Wheat Flour (Atta)', nameTelugu: 'గోధుమ పిండి (ఆటా)', category: 'flour', basePrice: 50, unit: 'kg', image: '/images/products/wheat-flour.jpg', inStock: true, description: 'Whole wheat flour for chapati' },
  { name: 'Maida', nameTelugu: 'మైదా', category: 'flour', basePrice: 45, unit: 'kg', image: '/images/products/maida.jpg', inStock: true, description: 'All purpose flour' },
  { name: 'Rava (Sooji)', nameTelugu: 'రవ్వ (సోజి)', category: 'flour', basePrice: 55, unit: 'kg', image: '/images/products/rava.jpg', inStock: true, description: 'Semolina for upma and kesari' },
  { name: 'Besan', nameTelugu: 'శనగ పిండి', category: 'flour', basePrice: 95, unit: 'kg', image: '/images/products/besan.jpg', inStock: true, description: 'Gram flour' },
  { name: 'Rice Flour', nameTelugu: 'బియ్యం పిండి', category: 'flour', basePrice: 60, unit: 'kg', image: '/images/products/rice-flour.jpg', inStock: true, description: 'Fine rice flour' },
  { name: 'Idli Rava', nameTelugu: 'ఇడ్లి రవ్వ', category: 'flour', basePrice: 65, unit: 'kg', image: '/images/products/idli-rava.jpg', inStock: true, description: 'Rice rava for soft idlis' },
  
  // Sugar & Salt
  { name: 'Sugar', nameTelugu: 'చక్కెర', category: 'sugar-salt', basePrice: 45, unit: 'kg', image: '/images/products/sugar.jpg', inStock: true, description: 'White refined sugar' },
  { name: 'Jaggery', nameTelugu: 'బెల్లం', category: 'sugar-salt', basePrice: 65, unit: 'kg', image: '/images/products/jaggery.jpg', inStock: true, description: 'Traditional cane jaggery' },
  { name: 'Salt', nameTelugu: 'ఉప్పు', category: 'sugar-salt', basePrice: 20, unit: 'kg', image: '/images/products/salt.jpg', inStock: true, description: 'Iodized table salt' },
  { name: 'Rock Salt', nameTelugu: 'రాతి ఉప్పు', category: 'sugar-salt', basePrice: 40, unit: 'kg', image: '/images/products/rock-salt.jpg', inStock: true, description: 'Natural rock salt' },
  { name: 'Brown Sugar', nameTelugu: 'బ్రౌన్ చక్కెర', category: 'sugar-salt', basePrice: 80, unit: 'kg', image: '/images/products/brown-sugar.jpg', inStock: true, description: 'Unrefined brown sugar' },
  
  // Tea & Coffee
  { name: 'Tea Powder', nameTelugu: 'టీ పొడి', category: 'tea-coffee', basePrice: 320, unit: 'kg', image: '/images/products/tea-powder.jpg', inStock: true, description: 'Premium CTC tea' },
  { name: 'Coffee Powder', nameTelugu: 'కాఫీ పొడి', category: 'tea-coffee', basePrice: 450, unit: 'kg', image: '/images/products/coffee-powder.jpg', inStock: true, description: 'Filter coffee powder' },
  { name: 'Green Tea', nameTelugu: 'గ్రీన్ టీ', category: 'tea-coffee', basePrice: 400, unit: 'kg', image: '/images/products/green-tea.jpg', inStock: true, description: 'Natural green tea leaves' },
  
  // Snacks & Biscuits
  { name: 'Parle-G Biscuits', nameTelugu: 'పార్లే-జి బిస్కెట్లు', category: 'snacks', basePrice: 10, unit: 'pack', image: '/images/products/parle-g.jpg', inStock: true, description: 'Classic glucose biscuits' },
  { name: 'Marie Gold', nameTelugu: 'మేరీ గోల్డ్', category: 'snacks', basePrice: 30, unit: 'pack', image: '/images/products/marie-gold.jpg', inStock: true, description: 'Light tea-time biscuits' },
  { name: 'Good Day', nameTelugu: 'గుడ్ డే', category: 'snacks', basePrice: 35, unit: 'pack', image: '/images/products/good-day.jpg', inStock: true, description: 'Cashew cookies' },
  { name: 'Maggi Noodles', nameTelugu: 'మ్యాగీ నూడుల్స్', category: 'snacks', basePrice: 14, unit: 'pack', image: '/images/products/maggi.jpg', inStock: true, description: '2-minute noodles' },
  { name: 'Kurkure', nameTelugu: 'కుర్కురే', category: 'snacks', basePrice: 20, unit: 'pack', image: '/images/products/kurkure.jpg', inStock: true, description: 'Crispy corn puffs' },
  { name: 'Mixture', nameTelugu: 'మిక్స్చర్', category: 'snacks', basePrice: 180, unit: 'kg', image: '/images/products/mixture.jpg', inStock: true, description: 'Traditional namkeen mixture' },
  
  // Dairy
  { name: 'Amul Butter', nameTelugu: 'అముల్ వెన్న', category: 'dairy', basePrice: 56, unit: 'pack', image: '/images/products/amul-butter.jpg', inStock: true, description: '100g salted butter' },
  { name: 'Amul Ghee', nameTelugu: 'అముల్ నెయ్యి', category: 'dairy', basePrice: 600, unit: 'litre', image: '/images/products/amul-ghee.jpg', inStock: true, description: 'Pure cow ghee' },
  { name: 'Paneer', nameTelugu: 'పన్నీర్', category: 'dairy', basePrice: 320, unit: 'kg', image: '/images/products/paneer.jpg', inStock: true, description: 'Fresh cottage cheese' },
  { name: 'Curd', nameTelugu: 'పెరుగు', category: 'dairy', basePrice: 45, unit: 'kg', image: '/images/products/curd.jpg', inStock: true, description: 'Fresh set curd' },
  
  // Personal Care
  { name: 'Soap (Lux)', nameTelugu: 'సబ్బు (లక్స్)', category: 'personal-care', basePrice: 38, unit: 'bar', image: '/images/products/lux-soap.jpg', inStock: true, description: 'Beauty soap bar' },
  { name: 'Shampoo (Clinic Plus)', nameTelugu: 'షాంపూ (క్లినిక్ ప్లస్)', category: 'personal-care', basePrice: 120, unit: 'bottle', image: '/images/products/shampoo.jpg', inStock: true, description: '175ml bottle' },
  { name: 'Toothpaste (Colgate)', nameTelugu: 'టూత్‌పేస్ట్ (కోల్గేట్)', category: 'personal-care', basePrice: 55, unit: 'tube', image: '/images/products/colgate.jpg', inStock: true, description: '100g dental cream' },
  { name: 'Hair Oil', nameTelugu: 'హెయిర్ ఆయిల్', category: 'personal-care', basePrice: 80, unit: 'bottle', image: '/images/products/hair-oil.jpg', inStock: true, description: 'Coconut hair oil 100ml' },
  
  // Cleaning
  { name: 'Surf Excel', nameTelugu: 'సర్ఫ్ ఎక్సెల్', category: 'cleaning', basePrice: 120, unit: 'kg', image: '/images/products/surf-excel.jpg', inStock: true, description: 'Detergent powder' },
  { name: 'Vim Bar', nameTelugu: 'విమ్ బార్', category: 'cleaning', basePrice: 25, unit: 'bar', image: '/images/products/vim-bar.jpg', inStock: true, description: 'Dish wash bar' },
  { name: 'Harpic', nameTelugu: 'హార్పిక్', category: 'cleaning', basePrice: 85, unit: 'bottle', image: '/images/products/harpic.jpg', inStock: true, description: 'Toilet cleaner 500ml' },
  { name: 'Floor Cleaner', nameTelugu: 'ఫ్లోర్ క్లీనర్', category: 'cleaning', basePrice: 95, unit: 'bottle', image: '/images/products/floor-cleaner.jpg', inStock: true, description: 'Lizol floor cleaner 500ml' },
  
  // Pooja Items
  { name: 'Agarbatti', nameTelugu: 'అగరబత్తి', category: 'pooja', basePrice: 40, unit: 'pack', image: '/images/products/agarbatti.jpg', inStock: true, description: 'Incense sticks pack' },
  { name: 'Camphor', nameTelugu: 'కర్పూరం', category: 'pooja', basePrice: 60, unit: 'pack', image: '/images/products/camphor.jpg', inStock: true, description: 'Pure camphor tablets' },
  { name: 'Kumkum', nameTelugu: 'కుంకుమ', category: 'pooja', basePrice: 25, unit: 'pack', image: '/images/products/kumkum.jpg', inStock: true, description: 'Red vermilion powder' },
  { name: 'Turmeric Sticks', nameTelugu: 'పసుపు కొమ్ములు', category: 'pooja', basePrice: 150, unit: 'kg', image: '/images/products/turmeric-sticks.jpg', inStock: true, description: 'Whole turmeric roots' },
  { name: 'Coconut', nameTelugu: 'కొబ్బరికాయ', category: 'pooja', basePrice: 40, unit: 'piece', image: '/images/products/coconut.jpg', inStock: true, description: 'Fresh dry coconut' },
]
