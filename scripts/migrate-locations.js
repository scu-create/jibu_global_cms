'use strict';

const locationsData = [
  {
    "Name": "Jibu Bugarama",
    "Address": "KABUSUNZU",
    "Phone": "+250788300556",
    "Email": "",
    "Position": [-2.700377, 29.006059]
  },
  {
    "Name": "Jibu Busanza",
    "Address": "KK 152 ST",
    "Phone": "+250788644511",
    "Email": "",
    "Position": [-1.995829, 30.145924]
  },
  {
    "Name": "Jibu Gahanga",
    "Address": "KK 15 RD – GAHANGA CENTER",
    "Phone": "+250788463898",
    "Email": "",
    "Position": [-2.013083, 30.103527]
  },
  {
    "Name": "Jibu Gasogi",
    "Address": "KK 359 ST",
    "Phone": "+250788300914",
    "Email": "",
    "Position": [-1.969364, 30.185889]
  },
  {
    "Name": "Jibu Gatenga",
    "Address": "KK 44 AVE – KK 593 ST",
    "Phone": "+250788419394",
    "Email": "",
    "Position": [-1.977563, 30.091563]
  },
  {
    "Name": "Jibu Gatsata",
    "Address": "RN3 – KIGALI - GATUNA RD",
    "Phone": "+250785786628",
    "Email": "",
    "Position": [-1.920638, 30.047694]
  },
  {
    "Name": "Jibu Gikondo",
    "Address": "KK 4 AVE – KK 686 ST",
    "Phone": "+250788387455",
    "Email": "",
    "Position": [-1.967, 30.074917]
  },
  {
    "Name": "Jibu Gisenyi I",
    "Address": "RN4 – PETITE BARRIERE - GISENYI RD",
    "Phone": "+250788350999",
    "Email": "",
    "Position": [-1.685444, 29.256556]
  },
  {
    "Name": "Jibu Gisenyi II",
    "Address": "AMAHORO",
    "Phone": "+250788302865",
    "Email": "",
    "Position": [-1.677485, 29.263466]
  },
  {
    "Name": "Jibu Huye",
    "Address": "RN1 – HUYE - NGOMA RD",
    "Phone": "+2507882180788",
    "Email": "",
    "Position": [-2.599694, 29.739692]
  },
  {
    "Name": "Jibu Kabeza",
    "Address": "KK 18 AVE – KK 242 ST",
    "Phone": "+250788387455",
    "Email": "",
    "Position": [-1.969688, 30.123438]
  },
  {
    "Name": "Jibu Kabuga",
    "Address": "KK 3 RD – KABUGA BUS STATION",
    "Phone": "+250788452850",
    "Email": "",
    "Position": [-1.979687, 30.223187]
  },
  {
    "Name": "Jibu Kabuye",
    "Address": "RN3 – KIGALI - GATUNA RD",
    "Phone": "+250785413091",
    "Email": "",
    "Position": [-1.899028, 30.058139]
  },
  {
    "Name": "Jibu Kagugu",
    "Address": "KG 14 AVE – KG 438 ST",
    "Phone": "+250788303046",
    "Email": "",
    "Position": [-1.915778, 30.085833]
  },
  {
    "Name": "Jibu Kanombe",
    "Address": "KN 5 RD – KK 97 ST",
    "Phone": "+250788678070",
    "Email": "",
    "Position": [-1.976889, 30.167055]
  },
  {
    "Name": "Jibu Karongi",
    "Address": "RN7 – KARONGI HOSPITAL",
    "Phone": "+250788899835",
    "Email": "",
    "Position": [-2.06859, 29.346101]
  },
  {
    "Name": "Jibu Kayonza",
    "Address": "RN3 – RWAMAGANA - KAYONZA RD",
    "Phone": "+250783402539",
    "Email": "",
    "Position": [-1.901917, 30.497085]
  },
  {
    "Name": "Jibu Kibagabaga",
    "Address": "KG 10 AVE – KG 294 ST",
    "Phone": "+250783200933",
    "Email": "",
    "Position": [-1.935562, 30.108188]
  },
  {
    "Name": "Jibu Kibungo",
    "Address": "RN3 - BRALIRWA NGOMA STORE",
    "Phone": "+250788524198",
    "Email": "",
    "Position": [-2.141553, 30.551467]
  },
  {
    "Name": "Jibu Kicukiro",
    "Address": "KK 15 RD – KK 488 ST",
    "Phone": "+250788519798",
    "Email": "",
    "Position": [-1.976663, 30.104386]
  },
  {
    "Name": "Jibu Kimihurura",
    "Address": "KN 7 RD – KN 10 ST",
    "Phone": "+250788485410",
    "Email": "",
    "Position": [-1.952972, 30.075667]
  },
  {
    "Name": "Jibu Kimironko I",
    "Address": "KG 11 AVE – KG 184 ST",
    "Phone": "+250788301644",
    "Email": "",
    "Position": [-1.95247, 30.120771]
  },
  {
    "Name": "Jibu Kimironko II",
    "Address": "KG 11 AVE – KG 3 ST",
    "Phone": "+250788312309",
    "Email": "",
    "Position": [-1.936611, 30.130972]
  },
  {
    "Name": "Jibu Kimisagara",
    "Address": "KN 20 AVE – KN 118 ST",
    "Phone": "+250784507829",
    "Email": "",
    "Position": [-1.956938, 30.053688]
  },
  {
    "Name": "Jibu Kinamba",
    "Address": "KN 8 AVE – KN 12 ST",
    "Phone": "+250788303046",
    "Email": "",
    "Position": [-1.934583, 30.061694]
  },
  {
    "Name": "Jibu Kinyinya",
    "Address": "KG 22 AVE",
    "Phone": "+250788780803",
    "Email": "",
    "Position": [-1.91769, 30.112694]
  },
  {
    "Name": "Jibu Kirehe",
    "Address": "RN3 - OPP. KIREHE MARKET",
    "Phone": "+250782460833",
    "Email": "",
    "Position": [-2.273816, 30.677567]
  },
  {
    "Name": "Jibu Mahoko",
    "Address": "RN4 – MAHOKO TAXI PARK",
    "Phone": "+250788354088",
    "Email": "",
    "Position": [-1.698139, 29.341639]
  },
  {
    "Name": "Jibu Masaka",
    "Address": "MASAKA HOSPITAL RD",
    "Phone": "+250787155984",
    "Email": "",
    "Position": [-1.99534, 30.19399]
  },
  {
    "Name": "Jibu Muhanga I",
    "Address": "RN1 – MUHANGA - HUYE RD",
    "Phone": "+250788583993",
    "Email": "",
    "Position": [-2.087313, 29.753688]
  },
  {
    "Name": "Jibu Muhanga II",
    "Address": "RN 1 - CYAKABIRI",
    "Phone": "+250788422336",
    "Email": "",
    "Position": [-1.941137, 30.060142]
  },
  {
    "Name": "Jibu Muhima",
    "Address": "KN 2 AVE – KN 87 ST",
    "Phone": "+250785121071",
    "Email": "",
    "Position": [-1.940941, 30.059843]
  },
  {
    "Name": "Jibu Musanze",
    "Address": "RN4 – RUE DU PYRETHRE",
    "Phone": "+250788587998",
    "Email": "",
    "Position": [-1.506899, 29.640342]
  },
  {
    "Name": "Jibu Musanze II",
    "Address": "BYIMANA",
    "Phone": "+250788751209",
    "Email": "",
    "Position": [-1.499918, 29.626269]
  },
  {
    "Name": "Jibu Musezero",
    "Address": "KG 14 AVE – KG 784 ST",
    "Phone": "+250788303046",
    "Email": "",
    "Position": [-1.917667, 30.055611]
  },
  {
    "Name": "Jibu Niboye",
    "Address": "KK 21 AVE – KK 353 ST",
    "Phone": "+250788301644",
    "Email": "",
    "Position": [-1.98014, 30.11542]
  },
  {
    "Name": "Jibu Nyabugogo",
    "Address": "GAKONI",
    "Phone": "+250788635332",
    "Email": "",
    "Position": [-1.938925, 30.048625]
  },
  {
    "Name": "Jibu Nyagatare",
    "Address": "RN13 - OPP. MBTC HOTEL",
    "Phone": "+250784303425",
    "Email": "",
    "Position": [-1.293577, 30.328061]
  },
  {
    "Name": "Jibu Nyamagabe",
    "Address": "KABACUZI",
    "Phone": "+250783129206",
    "Email": "",
    "Position": [-2.471025, 29.579806]
  },
  {
    "Name": "Jibu Nyamata",
    "Address": "RN15 – NYAMATA CENTER",
    "Phone": "+250788300914",
    "Email": "",
    "Position": [-2.140584, 30.083831]
  },
  {
    "Name": "Jibu Nyamirambo I",
    "Address": "KN 2 AVE – KN 102 ST",
    "Phone": "+250788258047",
    "Email": "",
    "Position": [-1.96575, 30.058889]
  },
  {
    "Name": "Jibu Nyamirambo II",
    "Address": "KN 2 AVE – KN 245 ST",
    "Phone": "+250788258047",
    "Email": "",
    "Position": [-1.980812, 30.045813]
  },
  {
    "Name": "Jibu Nyanza",
    "Address": "OPP. NYANZA MARKET - NYANZA RD",
    "Phone": "+250788932144",
    "Email": "",
    "Position": [-2.352161, 29.749684]
  },
  {
    "Name": "Jibu Rusizi",
    "Address": "RN6 – DIOCESE CARITAS CYANGUGU",
    "Phone": "+250788322266",
    "Email": "",
    "Position": [-2.483333, 28.896667]
  },
  {
    "Name": "Jibu Ruyenzi",
    "Address": "RN1 – LUX HOUSE",
    "Phone": "+250788303046",
    "Email": "",
    "Position": [-1.96771, 29.98477]
  },
  {
    "Name": "Jibu Rwamagana",
    "Address": "RN3 – MTN CENTER",
    "Phone": "+250788666302",
    "Email": "",
    "Position": [-1.954684, 30.436089]
  },
  {
    "Name": "Jibu Sonatube",
    "Address": "KG 1 AVE – KG 601 ST",
    "Phone": "+250788519798",
    "Email": "",
    "Position": [-1.96274, 30.102447]
  }
];

async function migrateLocations(strapi) {
  let createdCount = 0;
  for (const loc of locationsData) {
    try {
      const entryData = {
        locations: {
          name: loc.Name,
          address: loc.Address,
          position: JSON.stringify(loc.Position) 
        }
      };
      
      if (loc.Phone) entryData.locations.phone = loc.Phone;
      if (loc.Email) entryData.locations.email = loc.Email;

      await strapi.documents('api::rw.rw').create({
        data: entryData,
        status: 'published'
      });
      createdCount++;
      console.log(`Created location ${loc.Name} successfully.`);
    } catch (err) {
      console.error(`Failed to create ${loc.Name}: ${err.message}`);
    }
  }
  console.log(`\nSuccessfully created ${createdCount} locations in RW.`);
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  console.log('Starting Location Migration for Rwanda...');
  await migrateLocations(app);
  console.log('Migration Complete.');
  
  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
