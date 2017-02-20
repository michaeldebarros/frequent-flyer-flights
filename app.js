const request = require ('request');
const moment = require('moment');
const syncRequest = require('sync-request');
var origin = "NVT";
var destination = "MCO";
var numberOfAdults = "2";
var numberOfInfants = "0";
var numberOfChildren = "2";
//let dataInicial =  moment(process.argv[2],'DD/MM/YYYY', true).unix(); this was to get arguments from the command line
//let dataFinal = moment(process.argv[3], 'DD/MM/YYYY', true).unix();
var dataInicial =  moment('01/09/2017','DD/MM/YYYY', true).unix();
var dataFinal =  moment('30/10/2017','DD/MM/YYYY', true).unix();
var freshSessionId = '';
var freshDtCookie = '';

  if (numberOfInfants === "0"){
    numberOfInfants = "";
  };
  if (numberOfChildren === "0"){
    numberOfChildren = "";
  };

// get fresh cookies
  var res = syncRequest('GET', 'http://www.smiles.com.br/home');
  let freshResponseHeader1 = res.headers["set-cookie"][0];
  freshSessionId = freshResponseHeader1.match(/JSESSIONID=(.*); path/)[1];
  let freshResponseHeader2 = res.headers["set-cookie"][5];
  freshDtCookie = freshResponseHeader2.match(/dtCookie=(.*); path/)[1];

//---------------------------------------------------------------
// get the flights
while(dataInicial <= dataFinal){
  var headers = {
      'origin': 'https://www.smiles.com.br/home',
      //'accept-encoding': 'gzip, deflate, br',
      'x-requested-with': 'XMLHttpRequest',
      'accept-language': 'pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'referer': `https://www.smiles.com.br/passagens-com-milhas?tripType=2&originAirport=${origin}&destinationAirport=${destination}&departureDay=${dataInicial}&returnDay=null&adults=0${numberOfAdults}&children=0${numberOfChildren}&infants=0`,
      'authority': 'www.smiles.com.br',
      'Cookie': `cookie: COOKIE_SUPPORT=true; JSESSIONID=JSESSIONID=${freshSessionId}; GUEST_LANGUAGE_ID=pt_BR; sticky=blue; _ceg.s=of0mry; _ceg.u=of0mry; _dc_gtm_UA-39072057-4=1; _dc_gtm_UA-39072057-6=1; dtLatC=6; LFR_SESSION_STATE_10161=1476412019443; _ga=GA1.3.1557807000.1476185578; __zlcmid=d3fuuGOx9gX6aq; dtCookie=${freshDtCookie}; dtPC=-`
  };

  var dataString = `_smilessearchflightsresultportlet_WAR_smilesflightsportlet_JSONParameters={"getAvailableRequest":{"routes":[{"tripType":"ONE_WAY","origin":"${origin}","destination":"${destination}","originAirport":"${origin}","destinationAirport":"${destination}","departureDay":${dataInicial*1000},"returnDay":null,"departureDayFinal":null,"returnDayFinal":null,"adults":"${numberOfAdults}","infants":"${numberOfInfants}","children":"${numberOfChildren}","role":null,"currencyCode":"BRL","memberNumber":null,"memberChannel":null}],"forceCongenere":false}}`;

  var options = {
      url: `https://www.smiles.com.br/passagens-com-milhas?p_p_id=smilessearchflightsresultportlet_WAR_smilesflightsportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=getFlights&p_p_cacheability=cacheLevelPage&p_p_col_id=column-2&p_p_col_count=2&_smilessearchflightsresultportlet_WAR_smilesflightsportlet_currentURL=%2Fpassagens-com-milhas%3FtripType%3D2%26originAirport%3D${origin}%26destinationAirport%3D${destination}%26departureDay%${dataInicial}%26returnDay%3Dnull%26adults%3D0${numberOfAdults}%26children%3D0${numberOfChildren}%26infants%3D0${numberOfInfants}?noCache=1476412021010`,
      method: 'POST',
      headers: headers,
      body: dataString
  };

  function callback(error, response, body) {
          if (!error && response.statusCode == 200) {
          let resBody = JSON.parse(body);
          if(resBody.legs[0].categoryFlights){
            var numberOfFlights = resBody.legs[0].categoryFlights.length;
          }
          else {
            numberOfFlights = 0;
          };
          let dataDoVoo = resBody.availabilityRequest.routes[0].departureDay;
          console.log("\n" + moment(dataDoVoo).format("MMMM Do YYYY") + ": " + numberOfFlights + " flights" + "\n");
          for(let i = 0; i < resBody.legs[0].categoryFlights.length; i++){
            let company = resBody.legs[0].categoryFlights[i].flights[0].airCompany;
            let points = resBody.legs[0].categoryFlights[i].flights[0].smilesCost[0].smiles;
            console.log(`${company}: ${points} points`);
          };
      }
  };
    request(options, callback);
    dataInicial += 86400;
};
