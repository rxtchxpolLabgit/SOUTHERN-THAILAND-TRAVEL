export type AndamanProvince =
  | 'Phuket' | 'Phang Nga' | 'Krabi' | 'Trang' | 'Satun' | 'Ranong'
  | 'Chumphon' | 'Surat Thani' | 'Nakhon Si Thammarat' | 'Phatthalung'
  | 'Songkhla' | 'Pattani' | 'Yala' | 'Narathiwat';

export interface ImageAsset {
  readonly url: string;
  readonly alt: string;
  readonly source: 'Wikimedia Commons' | 'Andaman Smart Travel' | 'Thailand Tourism Directory' | 'Travel publication';
  readonly sourceUrl: string;
  readonly photographer: string;
  readonly license: string;
  readonly licenseUrl: string;
}

export interface PlaceImage extends ImageAsset {
  readonly fallbackUrl: string;
}

export function responsiveImageSrcset(url: string): string {
  if (!url.startsWith('https://thumb.wikimedia.org/wikipedia/commons/thumb/')) {
    return '';
  }

  const match = /\/(\d+)px-([^/]+)$/.exec(url);
  if (!match) {
    return '';
  }

  const originalWidth = Number(match[1]);
  const widths = [...new Set([250, 330, 500, 960, originalWidth])]
    .filter((width) => width <= originalWidth)
    .sort((left, right) => left - right);

  return widths
    .map((width) => `${url.replace(match[0], `/${width}px-${match[2]}`)} ${width}w`)
    .join(', ');
}

const fallbackByProvince: Record<AndamanProvince, string> = {
  Phuket: '/assets/image-fallbacks/phuket.svg',
  'Phang Nga': '/assets/image-fallbacks/phang-nga.svg',
  Krabi: '/assets/image-fallbacks/krabi.svg',
  Trang: '/assets/image-fallbacks/trang.svg',
  Satun: '/assets/image-fallbacks/satun.svg',
  Ranong: '/assets/image-fallbacks/ranong.svg',
  Chumphon: '/assets/image-fallbacks/chumphon.svg',
  'Surat Thani': '/assets/image-fallbacks/surat-thani.svg',
  'Nakhon Si Thammarat': '/assets/image-fallbacks/nakhon-si-thammarat.svg',
  Phatthalung: '/assets/image-fallbacks/phatthalung.svg',
  Songkhla: '/assets/image-fallbacks/songkhla.svg',
  Pattani: '/assets/image-fallbacks/pattani.svg',
  Yala: '/assets/image-fallbacks/yala.svg',
  Narathiwat: '/assets/image-fallbacks/narathiwat.svg',
};

export const imageAssets = {
  ranong: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Colorful_boats_resting_by_the_quiet_mangrove_river.jpg/960px-Colorful_boats_resting_by_the_quiet_mangrove_river.jpg',
    alt: 'Boats and mangrove forest at Mu Ko Ranong National Park', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Colorful_boats_resting_by_the_quiet_mangrove_river.jpg',
    photographer: 'Pandystudio', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  chumphon: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Mu_Ko_Chumphon_National_Park_Chumphon_Thailand.jpg/960px-Mu_Ko_Chumphon_National_Park_Chumphon_Thailand.jpg',
    alt: 'Islands and sea in Mu Ko Chumphon National Park', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mu_Ko_Chumphon_National_Park_Chumphon_Thailand.jpg',
    photographer: 'KOSIN SUKHUM', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  suratThani: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Koh_Samui%2C_Island%2C_Beach%2C_Thailand.jpg/960px-Koh_Samui%2C_Island%2C_Beach%2C_Thailand.jpg',
    alt: 'Beach on Koh Samui in Surat Thani', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Koh_Samui,_Island,_Beach,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  nakhonSiThammarat: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Khanom_Beach.jpg/960px-Khanom_Beach.jpg',
    alt: 'Nai Plao Beach on the Khanom coast, Nakhon Si Thammarat', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Khanom_Beach.jpg',
    photographer: 'Ahoerstemeier', license: 'CC BY-SA 1.0 / GFDL', licenseUrl: 'https://creativecommons.org/licenses/by-sa/1.0/',
  },
  phatthalung: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Thale_Noi_%28lake%29%2C_Phatthalung%2C_Thailand.jpg/960px-Thale_Noi_%28lake%29%2C_Phatthalung%2C_Thailand.jpg',
    alt: 'Wetlands at Thale Noi in Phatthalung', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Thale_Noi_(lake),_Phatthalung,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  songkhla: {
    url: 'https://files.thailandtourismdirectory.go.th/assets/upload/info/attraction/380/201710239e94006d9eb874385dddf13c9f724e6c010236.jpg',
    alt: 'Hub Ho Hin, the Red Rice Mill in Songkhla Old Town', source: 'Thailand Tourism Directory',
    sourceUrl: 'https://www.thailandtourismdirectory.go.th/en/attraction/380',
    photographer: 'Department of Tourism, Thailand', license: 'Official source credit; reuse terms not stated', licenseUrl: 'https://www.thailandtourismdirectory.go.th/en/attraction/380',
  },
  pattani: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Laem_Pho%2C_Yaring_District%2C_Pattani%2C_Thailand_-_panoramio_%281%29.jpg/960px-Laem_Pho%2C_Yaring_District%2C_Pattani%2C_Thailand_-_panoramio_%281%29.jpg',
    alt: 'Laem Ta Chi (Laem Pho), Pattani', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Laem_Pho,_Yaring_District,_Pattani,_Thailand_-_panoramio_(1).jpg',
    photographer: 'Mozhar', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  narathiwat: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Narabeach.jpg/960px-Narabeach.jpg',
    alt: 'Ao Manao beach in Narathiwat', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Narabeach.jpg',
    photographer: '(WT-en) Abstinent', license: 'Public domain', licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing#Public_domain',
  },
  yala: {
    url: 'https://www.saitiew.com/upload/2024/11/feu5p6fe9bds.jpg',
    alt: 'Aiyerweng Skywalk over Yala’s sea of mist at sunrise', source: 'Travel publication',
    sourceUrl: 'https://www.saitiew.com/%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%A7%E0%B8%A2%E0%B8%B0%E0%B8%A5%E0%B8%B2/',
    photographer: 'Saitiew.com', license: 'Source credit; reuse terms not stated', licenseUrl: 'https://www.saitiew.com/%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%A7%E0%B8%A2%E0%B8%B0%E0%B8%A5%E0%B8%B2/',
  },
  raksawarin: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Raksawarin_hot_spring.jpg/960px-Raksawarin_hot_spring.jpg',
    alt: 'Raksawarin Hot Springs in Ranong', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Raksawarin_hot_spring.jpg',
    photographer: 'Natthaporn3809', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  thaleNoi: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Thale_Noi_wetlands_2%2C_Phatthalung%2C_Thailand.jpg/960px-Thale_Noi_wetlands_2%2C_Phatthalung%2C_Thailand.jpg',
    alt: 'Wetlands at Thale Noi, Phatthalung', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Thale_Noi_wetlands_2,_Phatthalung,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  kataBeach: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Kata_beach_1.JPG/960px-Kata_beach_1.JPG',
    alt: 'Kata Beach in Phuket', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kata_beach_1.JPG',
    photographer: 'Aklyuch', license: 'Copyrighted free use', licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing#Copyrighted_free_use',
  },
  watPhraMahathat: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Wat_phra_mahathat_woramahawihan_nakhon_si_thammarat.jpg/960px-Wat_phra_mahathat_woramahawihan_nakhon_si_thammarat.jpg',
    alt: 'Wat Phra Mahathat Woramahawihan in Nakhon Si Thammarat', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wat_phra_mahathat_woramahawihan_nakhon_si_thammarat.jpg',
    photographer: 'KOSIN SUKHUM', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  piyamitTunnels: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Piyamit_Tunnels_5.jpg/960px-Piyamit_Tunnels_5.jpg',
    alt: 'Entrance to the Piyamit Tunnels in Betong, Yala', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Piyamit_Tunnels_5.jpg',
    photographer: 'Slleong', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  betongHotSprings: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Bonamron_1.jpg/960px-Bonamron_1.jpg',
    alt: 'Bonamron Hot Spring in Betong, Yala', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bonamron_1.jpg',
    photographer: 'Slleong', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  similanIslands: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Mu_Ko_Similan_National_Park_Thailand.jpg/960px-Mu_Ko_Similan_National_Park_Thailand.jpg',
    alt: 'Clear water and reef scenery at Mu Ko Similan National Park', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mu_Ko_Similan_National_Park_Thailand.jpg',
    photographer: 'KOSIN SUKHUM', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  sametNangshe: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Samet_Nangshe_Viewpoint.jpg/960px-Samet_Nangshe_Viewpoint.jpg',
    alt: 'Panoramic Phang Nga Bay view from Samet Nangshe Viewpoint', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Samet_Nangshe_Viewpoint.jpg',
    photographer: 'TomMumuPangPangEmma', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  emeraldPool: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Emerald_pool_park%2C_Krabi_provice%2C_Thailand_2018_3.jpg/960px-Emerald_pool_park%2C_Krabi_provice%2C_Thailand_2018_3.jpg',
    alt: 'Emerald Pool in the forest of Krabi', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Emerald_pool_park,_Krabi_provice,_Thailand_2018_3.jpg',
    photographer: 'Karelj', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  tigerCaveTemple: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Panorama_view_from_Tiger_Cave_Temple.jpg/960px-Panorama_view_from_Tiger_Cave_Temple.jpg',
    alt: 'Panoramic landscape from Tiger Cave Temple in Krabi', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Panorama_view_from_Tiger_Cave_Temple.jpg',
    photographer: 'kallerna', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  thaleBanPark: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Thale_Ban_National_Park_Satun_Thailand.jpg/960px-Thale_Ban_National_Park_Satun_Thailand.jpg',
    alt: 'Forest lake in Thale Ban National Park, Satun', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Thale_Ban_National_Park_Satun_Thailand.jpg',
    photographer: 'KOSIN SUKHUM', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  bangLangDam: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Khuean_Bang_Lang%2C_Bannang_Sata_District%2C_Yala%2C_Thailand_-_panoramio_%281%29.jpg/960px-Khuean_Bang_Lang%2C_Bannang_Sata_District%2C_Yala%2C_Thailand_-_panoramio_%281%29.jpg',
    alt: 'Bang Lang Dam and reservoir in Yala', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Khuean_Bang_Lang,_Bannang_Sata_District,_Yala,_Thailand_-_panoramio_(1).jpg',
    photographer: 'Kitti Lekakul', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  promthepCape: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Promthep_Cape_Phuket.jpg/960px-Promthep_Cape_Phuket.jpg',
    alt: 'Promthep Cape on Phuket island', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Promthep_Cape_Phuket.jpg',
    photographer: 'Christophe95', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  khaoLak: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Kaoh_Lak.jpg/960px-Kaoh_Lak.jpg',
    alt: 'Panoramic view of Khao Lak beach', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kaoh_Lak.jpg',
    photographer: 'Vincent', license: 'Public domain', licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing#Public_domain',
  },
  kohPhayam: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Thailand_-_Koh_Phayam_%2824847276346%29.jpg/960px-Thailand_-_Koh_Phayam_%2824847276346%29.jpg',
    alt: 'Koh Phayam island in Ranong', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Thailand_-_Koh_Phayam_(24847276346).jpg',
    photographer: 'Visions of Domino', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  ngaowaterfall: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%95%E0%B8%81%E0%B8%AB%E0%B8%87%E0%B8%B2%E0%B8%A7_Ngao_Waterfall_-_panoramio.jpg/960px-%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%95%E0%B8%81%E0%B8%AB%E0%B8%87%E0%B8%B2%E0%B8%A7_Ngao_Waterfall_-_panoramio.jpg',
    alt: 'Ngao Waterfall in Ranong', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%95%E0%B8%81%E0%B8%AB%E0%B8%87%E0%B8%B2%E0%B8%A7_Ngao_Waterfall_-_panoramio.jpg',
    photographer: '::::=UT=::::', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  phuKhaoYa: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%AB%E0%B8%8D%E0%B9%89%E0%B8%B2%E0%B8%9B%E0%B8%B52010-Bald_mountain_Ranong_-_panoramio.jpg/960px-%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%AB%E0%B8%8D%E0%B9%89%E0%B8%B2%E0%B8%9B%E0%B8%B52010-Bald_mountain_Ranong_-_panoramio.jpg',
    alt: 'The grassy hill landscape of Phu Khao Ya in Ranong', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%AB%E0%B8%8D%E0%B9%89%E0%B8%B2%E0%B8%9B%E0%B8%B52010-Bald_mountain_Ranong_-_panoramio.jpg',
    photographer: '::::=UT=::::', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  cheowLanLake: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Cheow_Lan_Lake%2C_Rainforest%2C_Fog_on_the_lake%2C_Khao_Sok%2C_Thailand.jpg/960px-Cheow_Lan_Lake%2C_Rainforest%2C_Fog_on_the_lake%2C_Khao_Sok%2C_Thailand.jpg',
    alt: 'Mist over Cheow Lan Lake in Khao Sok, Surat Thani', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cheow_Lan_Lake,_Rainforest,_Fog_on_the_lake,_Khao_Sok,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  phiPhi: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Isla_Ko_Phi_Phi_Don%2C_Tailandia%2C_2013-08-19%2C_DD_18.JPG/960px-Isla_Ko_Phi_Phi_Don%2C_Tailandia%2C_2013-08-19%2C_DD_18.JPG',
    alt: 'Limestone cliffs and turquoise water at Phi Phi Don, Thailand',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Isla_Ko_Phi_Phi_Don,_Tailandia,_2013-08-19,_DD_18.JPG',
    photographer: 'Diego Delso',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  mayaBay: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Playa_Maya%2C_Ko_Phi_Phi%2C_Tailandia%2C_2013-08-19%2C_DD_03.JPG/960px-Playa_Maya%2C_Ko_Phi_Phi%2C_Tailandia%2C_2013-08-19%2C_DD_03.JPG',
    alt: 'Maya Bay shoreline enclosed by limestone cliffs on Phi Phi Leh',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Playa_Maya,_Ko_Phi_Phi,_Tailandia,_2013-08-19,_DD_03.JPG',
    photographer: 'Diego Delso',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  railay: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Railay_beach%2C_Krabi_province%2C_Thailand_2018_3.jpg/960px-Railay_beach%2C_Krabi_province%2C_Thailand_2018_3.jpg',
    alt: 'Railay Beach backed by limestone cliffs in Krabi province',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Railay_beach,_Krabi_province,_Thailand_2018_3.jpg',
    photographer: 'Karelj',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  hongIsland: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/10.Ko_Hong_Island_-_Andaman_Sea_-_Krabi_Province%2C_Thailand.jpg/960px-10.Ko_Hong_Island_-_Andaman_Sea_-_Krabi_Province%2C_Thailand.jpg',
    alt: 'Ko Hong Island in the Andaman Sea, Krabi province',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:10.Ko_Hong_Island_-_Andaman_Sea_-_Krabi_Province,_Thailand.jpg',
    photographer: 'Wolfgang Holzem',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  kohLanta: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Ko_Lanta_Thailand-7.jpg/960px-Ko_Lanta_Thailand-7.jpg',
    alt: 'Coastline of Ko Lanta, Thailand',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ko_Lanta_Thailand-7.jpg',
    photographer: 'Dronepicr',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  kohLipe: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Koh_Lipe_%28island%29%2C_Sun%2C_Thailand.jpg/960px-Koh_Lipe_%28island%29%2C_Sun%2C_Thailand.jpg',
    alt: 'Beach and clear water on Ko Lipe island, Satun province',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Koh_Lipe_(island),_Sun,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  kohKradan: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/2016_Prowincja_Trang%2C_Ko_Kradan_%2802%29.jpg/960px-2016_Prowincja_Trang%2C_Ko_Kradan_%2802%29.jpg',
    alt: 'Ko Kradan island and its clear coastal water in Trang province',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2016_Prowincja_Trang,_Ko_Kradan_(02).jpg',
    photographer: 'Marcin Konsek',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  phangNgaBay: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Koh_Yao_Noi%2C_Palm_on_the_beach%2C_Phang_Nga_Bay%2C_Thailand.jpg/960px-Koh_Yao_Noi%2C_Palm_on_the_beach%2C_Phang_Nga_Bay%2C_Thailand.jpg',
    alt: 'Palm-lined beach on Ko Yao Noi in Phang Nga Bay',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Koh_Yao_Noi,_Palm_on_the_beach,_Phang_Nga_Bay,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  phuketOldTown: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Buildings_in_Old_Phuket_Town.jpg/960px-Buildings_in_Old_Phuket_Town.jpg',
    alt: 'Historic shophouse buildings in Old Phuket Town',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Buildings_in_Old_Phuket_Town.jpg',
    photographer: 'Christophe95',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  phuketOldTownStreet: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Phuket_Old_Town_Street_View_07.jpg/960px-Phuket_Old_Town_Street_View_07.jpg',
    alt: 'Street scene in Phuket Old Town',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Phuket_Old_Town_Street_View_07.jpg',
    photographer: 'JULIANISME',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  phuketOldTownStreetTwo: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Phuket_Old_Town_Street_View_08.jpg/960px-Phuket_Old_Town_Street_View_08.jpg',
    alt: 'Another view along a street in Phuket Old Town',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Phuket_Old_Town_Street_View_08.jpg',
    photographer: 'JULIANISME',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  koTapu: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Ko_Tapu_%28James_Bond%29_Island_in_Phang_Nga_Bay%2C_Thailand.jpg/960px-Ko_Tapu_%28James_Bond%29_Island_in_Phang_Nga_Bay%2C_Thailand.jpg',
    alt: 'Ko Tapu, also known as James Bond Island, in Phang Nga Bay',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ko_Tapu_(James_Bond)_Island_in_Phang_Nga_Bay,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  kohKradanTwo: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/2016_Prowincja_Trang%2C_Ko_Kradan_%2811%29.jpg/960px-2016_Prowincja_Trang%2C_Ko_Kradan_%2811%29.jpg',
    alt: 'Coastal scenery on Ko Kradan in Trang province',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2016_Prowincja_Trang,_Ko_Kradan_(11).jpg',
    photographer: 'Marcin Konsek',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  kohAdangLagoon: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Koh_Adang_%28island%29%2C_Lagoon%2C_Colors%2C_Thailand.jpg/960px-Koh_Adang_%28island%29%2C_Lagoon%2C_Colors%2C_Thailand.jpg',
    alt: 'Turquoise lagoon around Koh Adang in Satun province',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Koh_Adang_(island),_Lagoon,_Colors,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  kohAdangSky: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Koh_Adang_%28island%29%2C_Sky%2C_Thailand.jpg/960px-Koh_Adang_%28island%29%2C_Sky%2C_Thailand.jpg',
    alt: 'Koh Adang beneath an open sky in Satun province',
    source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Koh_Adang_(island),_Sky,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  morakotCave: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Inside_the_emerald_cave_(8161381748).jpg?width=960',
    alt: 'Inside the Emerald Cave (Tham Morakot) near Koh Muk, Trang', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Inside_the_emerald_cave_(8161381748).jpg',
    photographer: 'Nik Cyclist', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  tarutao: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tarutao_National_Marine_Park.jpg?width=960',
    alt: 'Phante Malaka Bay beach and lighthouse at Tarutao National Park', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tarutao_National_Marine_Park.jpg',
    photographer: 'Toey19863', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  thungWuaLaen: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Thung_Wua_Laen_beach_-_Chumphon.jpg/960px-Thung_Wua_Laen_beach_-_Chumphon.jpg',
    alt: 'Thung Wua Laen Beach in Chumphon', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Thung_Wua_Laen_beach_-_Chumphon.jpg',
    photographer: 'Lamacchiacosta', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  sichonBeach: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao_Thong_Not.jpg?width=960',
    alt: 'Beach at Ao Thong Not in Sichon, Nakhon Si Thammarat', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ao_Thong_Not.jpg',
    photographer: 'Ahoerstemeier', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  hinNgamBay: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao_Hin_Ngam_Sichon.jpg?width=960',
    alt: 'Hin Ngam Bay in Sichon, Nakhon Si Thammarat', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ao_Hin_Ngam_Sichon.jpg',
    photographer: 'Ahoerstemeier', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  sichonCoast: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Locals_Enjoying_a_Sunday_Holiday.jpg?width=960',
    alt: 'Beach at Prasarnsook Resort in Sichon, Nakhon Si Thammarat', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Locals_Enjoying_a_Sunday_Holiday.jpg',
    photographer: 'Christopher David Robin Williams', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  khaoOkThalu: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Khao_Ok_Thalu_and_Phatthalung.JPG/960px-Khao_Ok_Thalu_and_Phatthalung.JPG',
    alt: 'Khao Ok Thalu above Phatthalung town', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Khao_Ok_Thalu_and_Phatthalung.JPG',
    photographer: 'Peter in s', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  songkhlaOldTown: {
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Songkhla_13.jpg/960px-Songkhla_13.jpg',
    alt: 'Street art in Songkhla Old Town', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Songkhla_13.jpg',
    photographer: 'Slleong', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  samilaBeach: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Songkhla,_Thailand,_Samila_Beach,_2024.jpg?width=960',
    alt: 'Samila Beach in Songkhla', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Songkhla,_Thailand,_Samila_Beach,_2024.jpg',
    photographer: 'OPK-Photography', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  pattaniMosque: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pattani_Central_Mosque.jpg?width=960',
    alt: 'Pattani Central Mosque', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pattani_Central_Mosque.jpg',
    photographer: 'Poakpong', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  rusamilae: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rusamilae,_Mueang_Pattani_District,_Pattani,_Thailand_-_panoramio_(15).jpg?width=960',
    alt: 'Coast at Rusamilae, Pattani', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rusamilae,_Mueang_Pattani_District,_Pattani,_Thailand_-_panoramio_(15).jpg',
    photographer: 'Kitti Lekakul', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  halaBala: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/%E0%B8%9B%E0%B9%88%E0%B8%B2%E0%B8%AE%E0%B8%B2%E0%B8%A5%E0%B8%B2-%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%B2_(%E0%B8%99%E0%B8%A3%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B2%E0%B8%AA)_1.jpg?width=960',
    alt: 'Rainforest in Hala-Bala Wildlife Sanctuary, Narathiwat', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E0%B8%9B%E0%B9%88%E0%B8%B2%E0%B8%AE%E0%B8%B2%E0%B8%A5%E0%B8%B2-%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%B2_(%E0%B8%99%E0%B8%A3%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B2%E0%B8%AA)_1.jpg',
    photographer: 'Piyawat Chongkaichak', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  tangKuanHill: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%95%E0%B8%B1%E0%B8%87%E0%B8%81%E0%B8%A7%E0%B8%99_-_panoramio_(1).jpg?width=960',
    alt: 'Summit of Tang Kuan Hill in Songkhla', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%95%E0%B8%B1%E0%B8%87%E0%B8%81%E0%B8%A7%E0%B8%99_-_panoramio_(1).jpg',
    photographer: '::::=UT=::::', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  watChalong: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wat_Chalong_Phuket_(one_of_the_temples).jpg?width=960',
    alt: 'Wat Chalong temple complex in Phuket', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wat_Chalong_Phuket_(one_of_the_temples).jpg',
    photographer: 'Deepak-nsk', license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  pakMengBeach: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%A5%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%8A%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%B2%E0%B8%94%E0%B8%9B%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%A1%E0%B8%87_%E0%B8%88.%E0%B8%95%E0%B8%A3%E0%B8%B1%E0%B8%87_%2C_Pak_Meng_Beach_%2CTrang_-_panoramio.jpg?width=960',
    alt: 'Limestone headland beside Pak Meng Beach in Trang', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%A5%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%8A%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%B2%E0%B8%94%E0%B8%9B%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%A1%E0%B8%87_%E0%B8%88.%E0%B8%95%E0%B8%A3%E0%B8%B1%E0%B8%87_%2C_Pak_Meng_Beach_%2CTrang_-_panoramio.jpg',
    photographer: '::::=UT=::::', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  kohNgamYai: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Koh_Ngam_Yai_-_%E0%B9%80%E0%B8%81%E0%B8%B2%E0%B8%B0%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A1%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88_%E0%B8%88.%E0%B8%8A%E0%B8%B8%E0%B8%A1%E0%B8%9E%E0%B8%A3_-_panoramio.jpg?width=960',
    alt: 'Koh Ngam Yai island off the coast of Chumphon', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Koh_Ngam_Yai_-_เกาะง่ามใหญ่_จ.ชุมพร_-_panoramio.jpg',
    photographer: 'easy4444', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  angThong: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mu_Ko_Ang_Thong,_Islands_in_the_sea_2,_Thailand.jpg?width=960',
    alt: 'Islands in Mu Ko Ang Thong National Marine Park', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mu_Ko_Ang_Thong,_Islands_in_the_sea_2,_Thailand.jpg',
    photographer: 'Vyacheslav Argenberg', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  krueSeMosque: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kresek_Musjid_jpg_0005291.jpg?width=960',
    alt: 'Krue Se Mosque, a historic mosque in Pattani', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kresek_Musjid_jpg_0005291.jpg',
    photographer: 'Oisamu', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  songkhlaMuseum: {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Songkhla_national_museum.jpg?width=960',
    alt: 'Historic Songkhla National Museum building', source: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Songkhla_national_museum.jpg',
    photographer: 'Ahoerstemeier', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  khaoKopCave: {
    url: 'https://thailand.go.th/uploads/posts/photo_1684382387_0.jpeg',
    alt: 'Visitors exploring Tham Le Khao Kop cave in Trang', source: 'Travel publication',
    sourceUrl: 'https://thailand.go.th/public/issue-focus-detail/001_02_200?hl=en',
    photographer: 'THAILAND.GO.TH', license: 'Source credit; reuse terms not stated', licenseUrl: 'https://thailand.go.th/',
  },
  stegodonCave: {
    url: 'https://mpics-cdn-acc.mgronline.com/pics/Images/556000015705403.JPEG',
    alt: 'Boat tour inside Tham Le Stegodon in Satun', source: 'Travel publication',
    sourceUrl: 'https://mgronline.com/travel/detail/9560000152673',
    photographer: 'MGR Online', license: 'Source credit; reuse terms not stated', licenseUrl: 'https://mgronline.com/',
  },
  khaoChaisonHotSpring: {
    url: 'https://storage.googleapis.com/tripniceday/uploads/places/1623629682778.jpg',
    alt: 'Natural pool at Khao Chaison Hot Spring in Phatthalung', source: 'Travel publication',
    sourceUrl: 'https://www.tripniceday.com/en/place/%E0%B8%9A%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%82%E0%B8%B2%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%AA%E0%B8%99',
    photographer: 'Khao Chaison Hot Spring community page', license: 'Source credit; reuse terms not stated', licenseUrl: 'https://www.tripniceday.com/',
  },
  kiriwongVillage: {
    url: 'https://static.thairath.co.th/media/Dtbezn3nNUxytg04ayyipL2roeA9n8AjboJPsRVjkM0oFh.jpg',
    alt: 'River and forested mountains in Kiriwong Village', source: 'Travel publication',
    sourceUrl: 'https://en.thairath.co.th/lifestyle/travel/2924357',
    photographer: 'Thairath Online', license: 'Source credit; reuse terms not stated', licenseUrl: 'https://www.thairath.co.th/',
  },
  narathatBeach: {
    url: 'https://www.gplace.com/include/img_res/3/68/gp593dfade51fd3.jpg',
    alt: 'Narathat Beach lined with casuarina trees in Narathiwat', source: 'Travel publication',
    sourceUrl: 'https://www.gplace.com/6873',
    photographer: 'Patthadon Jindaphat via Gplace', license: 'Source credit; reuse terms not stated', licenseUrl: 'https://www.gplace.com/',
  }
} satisfies Record<string, ImageAsset>;

export const imageForProvince = (
  image: ImageAsset,
  province: AndamanProvince,
): PlaceImage => ({
  ...image,
  fallbackUrl: fallbackByProvince[province],
});

// 🖼️ แก้รูปหน้าจังหวัด: ปรับ imageAssets ด้านบน แล้วเลือก asset ให้จังหวัดที่นี่
export const provinceShowcaseImages: Record<AndamanProvince, PlaceImage> = {
  // IMAGE: Phuket — เปลี่ยน imageAssets.phuketOldTown
  Phuket: imageForProvince(imageAssets.phuketOldTown, 'Phuket'),
  // IMAGE: Phang Nga — เปลี่ยน imageAssets.phangNgaBay
  'Phang Nga': imageForProvince(imageAssets.phangNgaBay, 'Phang Nga'),
  // IMAGE: Krabi — เปลี่ยน imageAssets.railay
  Krabi: imageForProvince(imageAssets.railay, 'Krabi'),
  // IMAGE: Trang — เปลี่ยน imageAssets.kohKradan
  Trang: imageForProvince(imageAssets.kohKradan, 'Trang'),
  // IMAGE: Satun — เปลี่ยน imageAssets.kohLipe
  Satun: imageForProvince(imageAssets.kohLipe, 'Satun'),
  // IMAGE: Ranong — เปลี่ยน imageAssets.ranong
  Ranong: imageForProvince(imageAssets.ranong, 'Ranong'),
  // IMAGE: Chumphon — เปลี่ยน imageAssets.chumphon
  Chumphon: imageForProvince(imageAssets.chumphon, 'Chumphon'),
  // IMAGE: Surat Thani — เปลี่ยน imageAssets.suratThani
  'Surat Thani': imageForProvince(imageAssets.suratThani, 'Surat Thani'),
  // IMAGE: Nakhon Si Thammarat — เปลี่ยน imageAssets.nakhonSiThammarat
  'Nakhon Si Thammarat': imageForProvince(imageAssets.nakhonSiThammarat, 'Nakhon Si Thammarat'),
  // IMAGE: Phatthalung — เปลี่ยน imageAssets.phatthalung
  Phatthalung: imageForProvince(imageAssets.phatthalung, 'Phatthalung'),
  // IMAGE: Songkhla — เปลี่ยน imageAssets.songkhla
  Songkhla: imageForProvince(imageAssets.songkhla, 'Songkhla'),
  // IMAGE: Pattani — เปลี่ยน imageAssets.pattani
  Pattani: imageForProvince(imageAssets.pattani, 'Pattani'),
  // IMAGE: Yala — เปลี่ยน imageAssets.yala
  Yala: imageForProvince(imageAssets.yala, 'Yala'),
  // IMAGE: Narathiwat — เปลี่ยน imageAssets.narathiwat
  Narathiwat: imageForProvince(imageAssets.narathiwat, 'Narathiwat'),
};

export const andamanHeroImage = provinceShowcaseImages['Phang Nga'];
export const tripPlannerImage = provinceShowcaseImages.Krabi;

export function applyImageFallback(event: Event, fallbackUrl: string): void {
  const image = event.currentTarget;
  if (!(image instanceof HTMLImageElement)) {
    return;
  }

  if (image.dataset['fallbackApplied'] !== 'true') {
    image.dataset['fallbackApplied'] = 'true';
    image.srcset = '';
    image.src = fallbackUrl;
    return;
  }

  image.hidden = true;
  image.parentElement?.classList.add('image-failed');
}

