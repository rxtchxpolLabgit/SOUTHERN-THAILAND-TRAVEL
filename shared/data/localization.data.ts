const provinceNames: Record<string, string> = {
  Phuket: 'ภูเก็ต', 'Phang Nga': 'พังงา', Krabi: 'กระบี่', Trang: 'ตรัง', Satun: 'สตูล', Ranong: 'ระนอง',
  Chumphon: 'ชุมพร', 'Surat Thani': 'สุราษฎร์ธานี', 'Nakhon Si Thammarat': 'นครศรีธรรมราช',
  Phatthalung: 'พัทลุง', Songkhla: 'สงขลา', Pattani: 'ปัตตานี', Yala: 'ยะลา', Narathiwat: 'นราธิวาส',
};

const placeNames: Record<string, string> = {
  'Phi Phi Islands': 'หมู่เกาะพีพี', 'Railay Beach': 'หาดไร่เลย์', 'Koh Lipe': 'เกาะหลีเป๊ะ', 'Koh Kradan': 'เกาะกระดาน',
  'Phang Nga Bay': 'อ่าวพังงา', 'Phuket Old Town': 'เมืองเก่าภูเก็ต', 'Hong Islands': 'หมู่เกาะห้อง', 'Koh Lanta': 'เกาะลันตา',
  'Maya Bay': 'อ่าวมาหยา', 'Promthep Cape': 'แหลมพรหมเทพ', 'Khao Lak Coast': 'ชายฝั่งเขาหลัก', 'Morakot Cave': 'ถ้ำมรกต',
  'Tarutao National Park': 'อุทยานแห่งชาติตะรุเตา', 'Koh Phayam': 'เกาะพยาม', 'Raksawarin Hot Springs': 'บ่อน้ำร้อนรักษะวาริน',
  'Mu Ko Chumphon National Park': 'อุทยานแห่งชาติหมู่เกาะชุมพร', 'Thung Wua Laen Beach': 'หาดทุ่งวัวแล่น', 'Koh Samui': 'เกาะสมุย',
  'Khao Sok National Park': 'อุทยานแห่งชาติเขาสก', 'Wat Phra Mahathat Woramahawihan': 'วัดพระมหาธาตุวรมหาวิหาร',
  'Thale Noi Waterbird Park': 'อุทยานนกน้ำทะเลน้อย', 'Khao Ok Thalu': 'เขาอกทะลุ',
  'Songkhla Old Town': 'เมืองเก่าสงขลา', 'Samila Beach': 'หาดสมิหลา', 'Pattani Central Mosque': 'มัสยิดกลางปัตตานี',
  'Rusamilae Coast': 'ชายฝั่งรูสะมิแล', 'Aiyerweng Skywalk': 'สกายวอล์กอัยเยอร์เวง', 'Bang Lang Dam': 'เขื่อนบางลาง',
  'Narathat Beach': 'หาดนราทัศน์', 'Hala-Bala Wildlife Sanctuary': 'เขตรักษาพันธุ์สัตว์ป่าฮาลา-บาลา',
  'Wat Chalong': 'วัดฉลอง', 'Kata Beach': 'หาดกะตะ', 'Similan Islands National Park': 'อุทยานแห่งชาติหมู่เกาะสิมิลัน',
  'Samet Nangshe Viewpoint': 'จุดชมวิวเสม็ดนางชี', 'Emerald Pool': 'สระมรกต', 'Tiger Cave Temple': 'วัดถ้ำเสือ',
  'Tham Le Khao Kop': 'ถ้ำเลเขากอบ', 'Pak Meng Beach': 'หาดปากเมง', 'Thale Ban National Park': 'อุทยานแห่งชาติทะเลบัน',
  'Tham Le Stegodon': 'ถ้ำเลสเตโกดอน', 'Phu Khao Ya': 'ภูเขาหญ้า', 'Ngao Waterfall': 'น้ำตกหงาว',
  'Khao Matsee Viewpoint': 'จุดชมวิวเขามัทรี', 'Koh Ngam Yai': 'เกาะง่ามใหญ่', 'Ang Thong National Marine Park': 'อุทยานแห่งชาติหมู่เกาะอ่างทอง',
  'Cheow Lan Lake': 'ทะเลสาบเชี่ยวหลาน', 'Sichon Beach': 'หาดสิชล', 'Hin Ngam Bay': 'อ่าวหินงาม', 'Kiriwong Village': 'หมู่บ้านคีรีวง',
  'Pak Pra Canal': 'คลองปากประ', 'Khao Chaison Hot Spring': 'บ่อน้ำร้อนเขาชัยสน', 'Tang Kuan Hill': 'เขาตังกวน',
  'Songkhla National Museum': 'พิพิธภัณฑสถานแห่งชาติ สงขลา', 'Laem Ta Chi (Laem Pho)': 'แหลมตาชี (แหลมโพธิ์)',
  'Krue Se Mosque': 'มัสยิดกรือเซะ', 'Piyamit Tunnel': 'อุโมงค์ปิยะมิตร', 'Betong Hot Springs': 'บ่อน้ำร้อนเบตง',
  'Bacho Waterfall': 'น้ำตกปาโจ', 'Budo-Su-ngai Padi National Park': 'อุทยานแห่งชาติบูโด-สุไหงปาดี',
};

const categoryNames: Record<string, string> = {
  'Island escape': 'เที่ยวเกาะ', 'Beach & cliffs': 'ชายหาดและหน้าผา', 'Quiet island': 'เกาะพักผ่อน', 'Nature & kayaking': 'ธรรมชาติและพายเรือคายัก',
  'Culture & food': 'วัฒนธรรมและอาหาร', 'Nature & island life': 'ธรรมชาติและวิถีเกาะ', 'Coastal viewpoint': 'จุดชมวิวชายฝั่ง', 'Beach & nature': 'ชายหาดและธรรมชาติ',
  'Island & cave': 'เกาะและถ้ำ', 'Island & nature': 'เกาะและธรรมชาติ', 'Island & marine life': 'เกาะและสิ่งมีชีวิตใต้ทะเล', 'Hot springs & wellness': 'บ่อน้ำพุร้อนและสุขภาพ',
  'Islands & marine life': 'หมู่เกาะและโลกใต้ทะเล', 'Beach & coastal life': 'ชายหาดและวิถีชายฝั่ง', 'Island & beach': 'เกาะและชายหาด',
  'Rainforest & lake': 'ป่าฝนและทะเลสาบ', 'Culture & heritage': 'วัฒนธรรมและมรดก', 'Wetlands & wildlife': 'พื้นที่ชุ่มน้ำและสัตว์ป่า',
  'Viewpoint & nature': 'จุดชมวิวและธรรมชาติ', 'Beach & city': 'ชายหาดและเมือง', 'Architecture & culture': 'สถาปัตยกรรมและวัฒนธรรม',
  'Coastal community': 'ชุมชนชายฝั่ง', 'Mountain viewpoint': 'จุดชมวิวภูเขา', 'Lake & nature': 'ทะเลสาบและธรรมชาติ',
  'Beach & local life': 'ชายหาดและวิถีท้องถิ่น', 'Rainforest & wildlife': 'ป่าฝนและสัตว์ป่า',
  'Temple & culture': 'วัดและวัฒนธรรม', 'Beach & coast': 'ชายหาดและชายฝั่ง', 'Island & national park': 'หมู่เกาะและอุทยานแห่งชาติ',
  'Forest & swimming': 'ป่าและแหล่งเล่นน้ำ', 'Temple & viewpoint': 'วัดและจุดชมวิว', 'Cave & adventure': 'ถ้ำและผจญภัย',
  'Cave & geopark': 'ถ้ำและอุทยานธรณี',
  'Forest & lake': 'ป่าและทะเลสาบ', 'Lake & limestone scenery': 'ทะเลสาบและภูเขาหินปูน', 'Community & nature': 'ชุมชนและธรรมชาติ',
  'Wetlands & local life': 'พื้นที่ชุ่มน้ำและวิถีท้องถิ่น', 'Hot spring & nature': 'บ่อน้ำร้อนและธรรมชาติ', 'City viewpoint': 'จุดชมวิวเมือง',
  'Museum & heritage': 'พิพิธภัณฑ์และมรดก', 'Cape & coast': 'แหลมและชายฝั่ง', 'Historic architecture': 'สถาปัตยกรรมเก่าแก่',
  'History & forest': 'ประวัติศาสตร์และผืนป่า', 'Hot spring & wellness': 'บ่อน้ำร้อนและสุขภาพ', 'Waterfall & forest': 'น้ำตกและผืนป่า',
  'Forest & wildlife': 'ป่าและสัตว์ป่า', 'Waterfall & national park': 'น้ำตกและอุทยานแห่งชาติ', 'Grassland & viewpoint': 'ทุ่งหญ้าและจุดชมวิว',
  'Harbour viewpoint': 'จุดชมวิวท่าเรือ', 'Islands & national park': 'หมู่เกาะและอุทยานแห่งชาติ',
};

const placeDescriptions: Record<string, string> = {
  'Phi Phi Islands': 'หมู่เกาะพีพีโดดเด่นด้วยหน้าผาหินปูนและน้ำทะเลใส เหมาะสำหรับล่องเรือเที่ยวเกาะและดำน้ำ',
  'Railay Beach': 'ชายหาดบนคาบสมุทรที่โอบล้อมด้วยหน้าผาหินปูนของกระบี่ เดินทางเข้าถึงได้ทางเรือ',
  'Koh Lipe': 'เกาะเล็กในจังหวัดสตูล มีชายหาดสวยและเป็นจุดเริ่มต้นเดินทางสู่หมู่เกาะตะรุเตา',
  'Koh Kradan': 'เกาะสงบในจังหวัดตรัง มีชายหาดและน้ำทะเลใส เหมาะกับการพักผ่อนและดำน้ำตื้น',
  'Phang Nga Bay': 'อ่าวที่มีเกาะหินปูนกระจายอยู่ทั่วบริเวณ พร้อมชุมชนชายฝั่งและเส้นทางพายเรือ',
  'Phuket Old Town': 'ย่านเมืองเก่าภูเก็ตมีอาคารชิโนโปรตุกีส ร้านอาหาร และเรื่องราวของชุมชนเก่าแก่',
  'Hong Islands': 'หมู่เกาะห้องอยู่ท่ามกลางภูเขาหินปูน เหมาะกับการล่องเรือ พายเรือ และชมธรรมชาติ',
  'Koh Lanta': 'อำเภอเกาะลันตามีแนวชายฝั่งยาว บรรยากาศสบาย และแหล่งท่องเที่ยวทางธรรมชาติ',
  'Maya Bay': 'อ่าวมาหยาบนเกาะพีพีเลอยู่ในเขตอุทยานแห่งชาติ โปรดตรวจสอบประกาศและช่วงเวลาปิดพื้นที่ก่อนเดินทาง',
  'Promthep Cape': 'แหลมทางตอนใต้ของภูเก็ตที่มีวิวทะเลกว้างและเป็นจุดชมพระอาทิตย์ตกยอดนิยม',
  'Khao Lak Coast': 'แนวชายฝั่งอันดามันที่มีชายหาดและเป็นทางเชื่อมต่อไปยังพื้นที่อนุรักษ์ใกล้เคียง',
  'Morakot Cave': 'ถ้ำทะเลบนเกาะมุก เดินทางโดยเรือและต้องคำนึงถึงระดับน้ำกับสภาพทะเล',
  'Tarutao National Park': 'อุทยานแห่งชาติทางทะเลที่มีชายหาดและเส้นทางธรรมชาติ การเปิดพื้นที่อาจเปลี่ยนตามฤดูกาล',
  'Koh Phayam': 'เกาะบรรยากาศสงบ มีชายหาด เนินเขาปกคลุมด้วยป่า และวิถีชีวิตเรียบง่าย',
  'Raksawarin Hot Springs': 'สวนบ่อน้ำร้อนสาธารณะในตัวเมืองระนอง มีบ่อแร่และพื้นที่ร่มรื่น',
  'Mu Ko Chumphon National Park': 'อุทยานทางทะเลที่มีหมู่เกาะ แนวปะการัง และเส้นทางเรือชมธรรมชาติ',
  'Thung Wua Laen Beach': 'ชายหาดทรายยาวทางเหนือของตัวเมืองชุมพร บรรยากาศชายฝั่งค่อนข้างสงบ',
  'Koh Samui': 'เกาะในอ่าวไทยที่มีชายหาด ชุมชนท้องถิ่น และกิจกรรมกลางแจ้งหลากหลาย',
  'Khao Sok National Park': 'ผืนป่าคุ้มครองที่มีภูเขาหินปูนและทะเลสาบเชี่ยวหลานอยู่ภายในพื้นที่',
  'Wat Phra Mahathat Woramahawihan': 'วัดประวัติศาสตร์สำคัญและศูนย์รวมวัฒนธรรมของจังหวัดนครศรีธรรมราช',
  'Thale Noi Waterbird Park': 'พื้นที่ชุ่มน้ำจืดที่มีนก ทางน้ำ และดอกบัวซึ่งเปลี่ยนแปลงไปตามฤดูกาล',
  'Khao Ok Thalu': 'ภูเขาหินปูนรูปลักษณ์โดดเด่นใกล้ตัวเมืองพัทลุง มองเห็นทิวทัศน์โดยรอบ',
  'Songkhla Old Town': 'ย่านเมืองเก่าสงขลามีอาคารเก่า ศิลปะบนกำแพง และอาหารท้องถิ่น',
  'Samila Beach': 'ชายหาดในตัวเมืองสงขลาที่มีทางเดินเลียบทะเลและวิวอ่าวไทย',
  'Pattani Central Mosque': 'สถานที่สำคัญทางสถาปัตยกรรมของปัตตานี โปรดแต่งกายสุภาพและเคารพเวลาประกอบศาสนกิจ',
  'Rusamilae Coast': 'ชุมชนชายฝั่งทางเหนือของตัวเมืองปัตตานี มีวิถีประมงและทิวทัศน์อ่าวไทย',
  'Aiyerweng Skywalk': 'จุดชมวิวบนภูเขาใกล้เบตง มีชื่อเสียงเรื่องทะเลหมอกในช่วงเช้า',
  'Bang Lang Dam': 'อ่างเก็บน้ำขนาดใหญ่ท่ามกลางภูเขาและผืนป่าทางตอนใต้ของจังหวัดยะลา',
  'Narathat Beach': 'ชายหาดใกล้ตัวเมืองนราธิวาส มีแนวต้นสนทะเลทอดยาวเลียบฝั่ง',
  'Hala-Bala Wildlife Sanctuary': 'ผืนป่าคุ้มครองทางชายแดนใต้ โปรดตรวจสอบคำแนะนำการเข้าพื้นที่จากหน่วยงานก่อนเดินทาง',
  'Wat Chalong': 'วัดฉลองเป็นวัดสำคัญของภูเก็ต มีสถาปัตยกรรมและประวัติศาสตร์ที่น่าสนใจ',
  'Kata Beach': 'หาดกะตะเป็นชายหาดยอดนิยมของภูเก็ต เหมาะสำหรับพักผ่อนและชมวิวทะเล',
  'Similan Islands National Park': 'อุทยานแห่งชาติทางทะเลที่ขึ้นชื่อเรื่องเกาะและโลกใต้น้ำ โปรดตรวจสอบฤดูกาลเปิดอุทยาน',
  'Samet Nangshe Viewpoint': 'จุดชมวิวบนเนินเขาที่มองเห็นหมู่เกาะและอ่าวพังงาได้กว้างไกล',
  'Emerald Pool': 'สระน้ำธรรมชาติสีมรกตในพื้นที่ป่าของกระบี่ โปรดปฏิบัติตามข้อกำหนดของแหล่งท่องเที่ยว',
  'Tiger Cave Temple': 'วัดถ้ำเสือเป็นวัดและจุดชมวิวบนเขาในจังหวัดกระบี่ ควรเตรียมร่างกายก่อนขึ้นบันได',
  'Tham Le Khao Kop': 'ถ้ำเลเขากอบเป็นถ้ำที่มีทางน้ำและหินงอกหินย้อย ควรเที่ยวกับผู้ให้บริการในพื้นที่',
  'Pak Meng Beach': 'หาดปากเมงเป็นชายหาดสำคัญของตรังและเป็นจุดเดินทางไปยังเกาะใกล้เคียง',
  'Thale Ban National Park': 'อุทยานแห่งชาติที่มีป่าและทะเลสาบใกล้ชายแดนไทย–มาเลเซีย',
  'Tham Le Stegodon': 'ถ้ำเลสเตโกดอนเป็นแหล่งธรณีวิทยาสำคัญของสตูล การเข้าชมต้องอาศัยเรือและไกด์ท้องถิ่น',
  'Phu Khao Ya': 'ภูเขาหญ้าเป็นเนินเขาเปิดโล่งในระนอง สีสันของทุ่งหญ้าเปลี่ยนไปตามฤดูกาล',
  'Ngao Waterfall': 'น้ำตกหงาวเป็นน้ำตกเด่นของระนอง ควรตรวจสอบสภาพอากาศและประกาศอุทยาน',
  'Khao Matsee Viewpoint': 'จุดชมวิวเขามัทรีมองเห็นอ่าวชุมพร เรือประมง และแนวชายฝั่ง',
  'Koh Ngam Yai': 'เกาะง่ามใหญ่เป็นเกาะนอกชายฝั่งที่มีภูมิประเทศหินปูนและเส้นทางเดินเรือชมวิว',
  'Ang Thong National Marine Park': 'หมู่เกาะอนุรักษ์ในอ่าวไทย การเดินทางและการปิดพื้นที่ขึ้นอยู่กับฤดูกาล',
  'Cheow Lan Lake': 'ทะเลสาบในเขาสกมีภูเขาหินปูนและแพพักกลางน้ำ ควรจองและตรวจสอบการเดินทางล่วงหน้า',
  'Hin Ngam Bay': 'อ่าวหินงามเป็นชายหาดและจุดชมวิวชายฝั่งในอำเภอสิชล',
  'Sichon Beach': 'ชายหาดริมอ่าวไทยในอำเภอสิชล ใกล้อ่าวหินงาม พร้อมวิวชายฝั่งและบรรยากาศทะเลท้องถิ่น',
  'Kiriwong Village': 'หมู่บ้านคีรีวงในอำเภอลานสกาโดดเด่นด้วยลำธาร สวนผลไม้ และอากาศจากหุบเขา',
  'Pak Pra Canal': 'คลองปากประเป็นจุดล่องเรือชมยอยกปลา วิถีประมง และแสงเช้าใกล้ทะเลน้อย',
  'Khao Chaison Hot Spring': 'บ่อน้ำร้อนและภูเขาหินปูนในจังหวัดพัทลุง เหมาะกับการแวะพักผ่อน',
  'Tang Kuan Hill': 'เขาตังกวนเป็นจุดชมวิวเหนือเมืองสงขลาและชายฝั่งอ่าวไทย',
  'Songkhla National Museum': 'พิพิธภัณฑสถานแห่งชาติตั้งอยู่ในอาคารประวัติศาสตร์ ใกล้ย่านเมืองเก่าสงขลา',
  'Laem Ta Chi (Laem Pho)': 'แหลมตาชีเป็นสันทรายยาวบริเวณอ่าวปัตตานี เหมาะกับชมวิวทะเลและแสงเช้าหรือเย็น',
  'Krue Se Mosque': 'มัสยิดกรือเซะเป็นโบราณสถานสำคัญและแหล่งเรียนรู้ประวัติศาสตร์ปัตตานี',
  'Piyamit Tunnel': 'อุโมงค์ปิยะมิตรเป็นแหล่งประวัติศาสตร์ใกล้เบตง ตั้งอยู่ท่ามกลางพื้นที่ภูเขาและป่า',
  'Betong Hot Springs': 'บ่อน้ำร้อนธรรมชาติในอำเภอเบตง เป็นจุดแวะพักยอดนิยมของนักเดินทาง',
  'Bacho Waterfall': 'น้ำตกปาโจอยู่ในอุทยานแห่งชาติบูโด–สุไหงปาดี โปรดตรวจสอบคำแนะนำการเข้าพื้นที่',
  'Budo-Su-ngai Padi National Park': 'อุทยานแห่งชาติผืนป่าภูเขาที่ครอบคลุมพื้นที่นราธิวาส ปัตตานี และยะลา',
};

const provinceDescriptions: Record<string, string> = {
  Phuket: 'วิถีเกาะและชายหาดสีสันสดใส', 'Phang Nga': 'ธรรมชาติ หมู่เกาะ และภูเขาหินปูน', Krabi: 'หน้าผา ชายหาด และการผจญภัยทางทะเล',
  Trang: 'หมู่เกาะเงียบสงบและน้ำทะเลใส', Satun: 'หมู่เกาะธรรมชาติและโลกใต้ทะเล', Ranong: 'ป่าฝน บ่อน้ำร้อน และชายฝั่งอันดามันอันเงียบสงบ',
  Chumphon: 'ธรรมชาติชายฝั่งและประตูสู่หมู่เกาะภาคใต้', 'Surat Thani': 'เส้นทางหมู่เกาะและอ่าวไทย',
  'Nakhon Si Thammarat': 'ชุมชนเก่าแก่และวัฒนธรรมภาคใต้', Phatthalung: 'พื้นที่ชุ่มน้ำ ทะเลสาบ และวิถีท้องถิ่น',
  Songkhla: 'ย่านเมืองเก่าและวัฒนธรรมอาหารใต้', Pattani: 'ชุมชนชายฝั่งและมรดกท้องถิ่นอันโดดเด่น',
  Yala: 'ภูเขา ทะเลหมอก และวิถีชีวิตท้องถิ่น', Narathiwat: 'ภูมิทัศน์ชายฝั่งและมรดกท้องถิ่น',
};

export function provinceName(name: string, language: 'en' | 'th'): string {
  return language === 'th' ? provinceNames[name] ?? name : name;
}

export function placeName(name: string, language: 'en' | 'th'): string {
  return language === 'th' ? placeNames[name] ?? name : name;
}

export function placeCategory(name: string, language: 'en' | 'th'): string {
  return language === 'th' ? categoryNames[name] ?? name : name;
}

export function placeDescription(name: string, description: string, language: 'en' | 'th'): string {
  return language === 'th' ? placeDescriptions[name] ?? description : description;
}

export function provinceDescription(name: string, description: string, language: 'en' | 'th'): string {
  return language === 'th' ? provinceDescriptions[name] ?? description : description;
}
