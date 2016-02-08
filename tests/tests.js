
var assert = require ("assert");
var Trendyways = require ("../trendyways.js");

describe ("Functions", function () {

	it ("gets the max value from a simple serie", function () {
		var serie = [0,6,2,7,8,9]
   	assert.equal (9, max (serie));
	});

	it ("gets the min value from a sample serie", function () {
		var serie = [0,6,2,7,8,9]
   	assert.equal (0, min (serie));
	});

	it ("gets the mean from zero values", function () {
   	var serie = [];
   	assert.equal (0, mean(serie));
	});

  it ("gets the mean of a simple serie", function () {
   	var serie = [2,6,5,7,10,9,12,5]
   	assert.equal (7, mean(serie));
	});

	// Values from the wikipedia for an example of Standard Deviation:
	// http://en.wikipedia.org/wiki/Standard_deviation 
	it ("gets the standard deviation of a serie", function () {
   var serie = [2,4,4,4,5,5,7,9]
   assert.equal (2, sd(serie));
	});

	it ("calculates the MSE from a series", function ()
	{
  	var s1 = [];
  	var s2 = [];
  	var mseResult = mse (s1, s2);
  	assert.equal (0, mseResult);
  	s1 = [0,0,0,0,0];
  	s2 = [0,0,0,0,0];
  	mseResult = mse(s1, s2);
  	assert.equal (0, mseResult);
  	s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5];
  	s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1];
  	assert.equal (0, mse(s1, s1));
  	assert.equal (101.22833333333334, mse(s1, s2));
	});

it ("RMSE root-squared mean standard error test", function ()
{
  var s1 = [];
  var s2 = [];
  assert.equal (rmse(s1,s2), 0, "Empty series return RMSE = 0")
  s1 = [0,0,0,0,0]
  s2 = [0,0,0,0,0]
  assert.equal (rmse(s1,s2), 0, "Zeroed-series return RMSE = 0");
  s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
  s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
  assert.equal (rmse(s1, s1), 0, "Equal vectors return RMSE = 0");
  assert.equal (rmse(s1, s2).toFixed(7), 10.0612292, "RMSE of two sample vectors");
});

it ("MAE mean absolute error test", function ()
{
  var s1 = [];
  var s2 = [];
  assert.equal (mae(s1,s2), 0, "Empty series return MAE = 0")
  s1 = [0,0,0,0,0]
  s2 = [0,0,0,0,0]
  assert.equal (mae(s1,s2), 0, "Zeroed-series return MAE = 0");
  s1 = [1.2, 3.4, -7.8, 2.3, 8.9, 5]
  s2 = [2.2, 8.4, 7.8, -2.3, -8.9, 5.1]
  assert.equal (mae(s1, s1), 0, "Equal vectors return MAE = 0");
  assert.equal (mae(s1, s2).toFixed(2), 7.35, "MAE of two sample vectors");
});

/**
 * This test checks multiple window of size n and different k values on
 * a sample serie.
 */
it ("Bollinger bands values for a sample serie", function () {
   var serie = [2.1,4.3,4.5,4.8,5.0,5.8,7.1,9.1]
   for (var k = 1; k < 4; k++)
   {  
      for (var n = 1; n < serie.length; n++)
      {
         var bands = bollinger (serie, n, k); // window size n = 3, k = 3
         assert.deepEqual (bands.upperBand.length, serie.length - n + 1, "Upper band length is correct");
         assert.deepEqual (bands.lowerBand.length, serie.length - n + 1, "Lower band length is correct");
         assert.deepEqual (bands.ma.length, serie.length - n + 1, "Moving average band length is correct");
         for (var i = 0; i < serie.length-n+1; i++)
         {
            var stdDev = sd(serie.slice(i,i+n));
            assert.deepEqual (bands.upperBand[i], bands.ma[i] + stdDev * k, "Upper value nº " + i + " correct (n="+n+",k="+k+")");
            assert.deepEqual (bands.lowerBand[i], bands.ma[i] - stdDev * k, "Lower value nº " + i + " correct (n="+n+",k="+k+")");
         }
      }
   }
});



it ("Moving Average of a sample serie", function () {
   var serie = [2,6,5,7,10,9,12,5];
   var correctValues = [5,7,7.75,9.5,9];
   var movingAvg = ma(serie,4);
   assert.deepEqual (movingAvg.length, 5, "Moving Average result's length is correct");
   for (var i = 0; i < 5; i++)
   {
      assert.deepEqual (movingAvg[i], correctValues[i], "MA value " + i + " is correct");
   }
});

it ("Exponential moving average test", function ()
{
  var series = [64.75, 63.79, 63.73, 63.73, 63.55, 
                63.19, 63.91, 63.85, 62.95, 63.37, 
                61.33, 61.51, 61.87, 60.25, 59.35, 
                59.95, 58.93, 57.68, 58.82, 58.87];
  var expected = [ 0,0,0,0,0,0,0,0,0,
                   63.682,63.254,62.937,62.743,62.290,
                   61.755,61.427,60.973,60.374,60.092,
                   59.870
                 ];
  var result = ema(series, 10);
  assert.equal (result.length, expected.length, "EMA length = " + result.length);
  for (var i = 0; i < 10 - 1; i++)
  {
    assert.equal (result[i], expected[i], "Checking EMA index = " + i)
  }
  for (var i = 10-1; i < result.length; i++)
  {
    assert.equal (result[i].toFixed(3), expected[i], "Checking EMA index = " + i)
  }
  result = ema(series, 1);
  for (var i = 0; i < result.length; i++)
  {
    assert.equal (result[i].toFixed(3), series[i], "EMA = 1, value " + i + " unchanged");
  }
});

it ("Weighted moving average test", function ()
{
  var series = [1, 2, 3, 4, 5, 6];
  var expected = [0.5, 0.83333, 1.16667, 1.5]
  var result = wma (series, [0.6, 0.3, 0.1]);
  for (var i = 0; i < result.length; i++)
  {
    assert.equal (expected[i], result[i].toFixed(5), "Testing WMA value " + i);
  }
});

it ("Money Flow Index test", function ()
{
  var highPrices = [4161, 4181, 4158, 4136, 4088, 4134, 4095, 4151,
                    4150, 4181, 4232, 4228, 4269, 4282, 4291, 4251,
                    4256, 4296, 4299, 4302, 4307, 4326, 4363];
  var lowPrices = [4081, 4110, 4104, 4066, 4031, 4058, 3981, 4072,
                   4102, 4113, 4172, 4177, 4218, 4234, 4231, 4189,
                   4141, 4243, 4249, 4241, 4250, 4289, 4256];
  var closePrices = [4151, 4117, 4111, 4077, 4079, 4067, 4077, 4134,
                     4120, 4171, 4220, 4215, 4261, 4278, 4246, 4205,
                     4248, 4257, 4293, 4250, 4296, 4297, 4267];
  var volumes = [79370729, 67472022, 63121628, 71942510, 65147231,74202811, 101610206, 95639685, 
  				 82708097, 78503267, 92236562, 68771304, 91866901, 85013484, 83254495, 78696265, 
  				 87574680, 82687609, 70929391, 88198865, 105631422, 73330395, 81067590];
  var result = [59.76142, 53.17167, 59.62856, 66.1453, 71.79791,
                64.67398, 73.14163, 72.71666, 65.73574];
  var mfiResult = mfi (highPrices, lowPrices, closePrices, volumes, 14);
  assert.equal (mfiResult.length, result.length,"MoneyFlow result values match length");
  for (var i = 0; i < mfiResult.length; i++)
  {
    assert.deepEqual (mfiResult[i].toFixed(1), result[i].toFixed(1), "MoneyFlow " + i + " value ok");
  }
});

/**
 * MACD test using IBM close values from 2013-01-01 to 17-01-2014.
 * Test results obtained with R library "quantmod": MACD("IBM", from="2013-01-01", to="17-01-2014")
 */
it ("MACD test", function () {
  var testData  = [196.35,195.27,193.99,193.14,192.87,192.32,192.88,194.45,192.62,
                192.50,192.59,193.65,194.47,196.08,204.72,204.42,
                204.97,204.93,203.90,203.52,203.07,205.18,203.79,
                202.79,201.02,199.74,201.68,200.16,200.04,200.09,
                199.65,200.98,200.32,199.31,198.33,201.09,197.51,199.14,202.33,
                200.83,202.91,205.19,206.53,208.38,209.42,210.38,210.08,210.55,212.06,
                215.80,214.92,213.21,213.44,215.06,212.26,212.08,210.74,212.36,210.89,213.30,
                212.38,214.36,212.66,211.31,209.41,209.32,209.22,212.00,212.92,211.38,209.26,212.00,
                209.67,207.15,190.00,187.83,191.61,191.71,193.95,194.31,199.15,202.54,199.63,202.39,204.51,
                202.78,203.63,204.82,203.24,204.47,202.47,203.21,203.32,204.69,208.44,207.60,208.65,206.99,
                206.16,205.72,207.78,207.92,209.36,208.02,208.95,206.19,202.74,203.80,206.35,205.02,203.98,
                201.20,203.77,202.20,203.04,204.87,201.94,197.35,195.46,193.54,194.98,194.86,195.65,191.11,
                191.28,191.50,193.25,194.93,194.98,191.30,192.25,192.80,192.07,194.00,193.85,194.55,197.99,
                193.54,194.09,194.98,196.61,197.22,197.35,196.21,196.01,195.04,195.81,195.16,195.50,190.99,
                188.56,187.93,187.82,189.09,188.42,187.53,185.79,185.34,184.23,184.56,184.86,185.19,185.42,
                184.74,182.74,182.16,182.64,182.27,183.96,183.13,184.15,183.03,184.98,186.60,190.70,190.73,
                192.17,193.15,192.16,194.42,193.39,190.02,190.99,189.97,189.47,190.22,186.92,185.18,186.38,
                184.96,183.86,184.10,182.01,178.72,181.32,184.77,186.16,186.97,184.66,186.73,174.83,173.78,
                172.86,174.97,175.77,177.80,176.85,177.35,182.12,180.15,179.21,179.23,180.27,177.85,179.19,
                180.00,179.99,182.88,183.07,183.55,182.21,183.19,184.47,185.25,185.19,184.13,181.30,178.94,
                177.31,178.97,179.68,177.48,176.08,175.74,176.08,177.67,177.46,177.12,175.20,173.37,172.80,
                177.85,175.76,178.70,180.22,180.02,182.23,183.22,185.35,185.08,186.41,187.57,185.53,186.64,
                186.00,189.71,187.97,187.38,187.26,184.16,185.92,187.74,188.76,190.09];

  var macdTest =  [0,0,0,0,0,0,0,0,
                   0,0,0,0,0,0,0,0,
                   0,0,0,0,0,0,0,0,0,
                1.65754960,1.53745561,1.36558626,1.21065468,1.07749703,0.94343290,0.88055663,
                0.79500891,0.67875283,0.54088660,0.53672501,0.38458302,0.32602610,0.40374827,
                0.40010647,0.47544149,0.61925614,0.77719919,0.96403208,1.13895103,1.29915537,
                1.39693680,1.47487252,1.57643159,1.78021639,1.88381552,1.87715924,1.85863713,
                1.88362980,1.77530605,1.66329290,1.50593247,1.42667740,1.29276617,1.26407186,
                1.19233443,1.19700863,1.12285943,1.00116387,0.82286064,0.67035244,0.53941100,
                0.53579399,0.56153836,0.51710540,0.39632733,0.40073399,0.31154727,0.14263140,
                -0.64733723,-1.35264065,-1.75011082,-2.04225251,-2.16214059,-2.21887050,-2.04526369,
                -1.75040206,-1.61548727,-1.38127548,-1.09772942,-0.93183167,-0.75756927,-0.56543456,
                -0.47091288,-0.34302598,-0.31771899,-0.26513048,-0.21658018,-0.12221988,0.09999611,
                0.23952545,0.38663683,0.43256134,0.43126764,0.40822572,0.46541984,0.51017982,0.59491991,
                0.60255332,0.63741517,0.55102867,0.34385631,0.21839053,0.21632683,0.16072377,0.07497507,
                -0.10123613,-0.13835019,-0.22713131,-0.26144102,-0.21389202,-0.28868775,-0.52424272,
                -0.77855752,-1.04672241,-1.18933075,-1.29335775,-1.32925091,-1.52575140,-1.65726094,
                -1.73385618,-1.70371703,-1.59247196,-1.48518354,-1.53471407,-1.51775541,-1.46493132,
                -1.43705801,-1.31967604,-1.21883709,-1.09716752,-0.84814998,-0.82579296,-0.77637194,
                -0.69231486,-0.55178058,-0.41049636,-0.28990422,-0.23866264,-0.20395162,-0.21397861,
                -0.18800461,-0.19201932,-0.17911462,-0.35126076,-0.58255154,-0.78427523,-0.93904708,
                -0.99768176,-1.06058806,-1.13545342,-1.25472147,-1.35375348,-1.46371416,-1.52023858,
                -1.53518326,-1.51585360,-1.47396366,-1.45362395,-1.50707459,-1.55741681,-1.55915692,
                -1.55918773,-1.46883734,-1.41727594,-1.31676236,-1.27150670,-1.13725646,-0.94906754,
                -0.61430539,-0.34447910,-0.06834215,0.18952130,0.34660618,0.56043941,0.67739936,0.61957555,
                0.60790817,0.54902204,0.47565343,0.44423978,0.27590264,0.06725662,-0.04666376,-0.19576618,
                -0.35751720,-0.47044708,-0.64338617,-0.91392548,-1.00479107,-0.91582216,-0.77565175,
                -0.62208417,-0.59418961,-0.47641960,-0.89278223,-1.25812928,-1.57391130,-1.71306370,
                -1.76852669,-1.70234343,-1.67366495,-1.61017947,-1.32957182,-1.18218693,-1.09499882,
                -1.01333207,-0.89156874,-0.89357296,-0.82545151,-0.72664289,-0.64137852,-0.43901288,
                -0.26729777,-0.10876226,-0.04255170,0.05287569,0.18308889,0.31686877,0.41508605,
                0.44083670,0.33249918,0.14053372,-0.08344146,-0.18544661,-0.23211873,-0.36332140,
                -0.52445456,-0.66048742,-0.74494707,-0.73193978,-0.72286884,-0.72281822,-0.80072006,
                -0.93536556,-1.05672987,-0.91212783,-0.88275613,-0.71702394,-0.51065590,-0.35234118,
                -0.12554985,0.09714513,0.36429615,0.55636085,0.75810149,0.95716194,1.01208880,1.09145564,
                1.11286062,1.27708161,1.31499355,1.30384106,1.27481414,1.10420845,1.03370099,1.04481710,1.08506735,1.16066447];

              var signalTest = [0,0,0,0,0,0,0,
                                0,0,0,0,0,0,0,
                                0,0,0,0,0,0,0,
                                0,0,0,0,0,0,0,
                                0,0,0,0,0,
                  1.127388273,1.010087939,0.915415354,0.809248886,0.712604329,0.650833117,0.600687788,0.575638528,
                  0.584362049,0.622929478,0.691149999,0.780710206,0.884399238,0.986906750,1.084499905,1.182886242,
                  1.302352272,1.418644922,1.510347786,1.580005655,1.640730485,1.667645598,1.666775057,1.634606540,
                  1.593020713,1.532969805,1.479190217,1.421819060,1.376856974,1.326057465,1.261078746,1.173435125,
                  1.072818589,0.966137071,0.880068454,0.816362436,0.756511029,0.684474290,0.627726229,0.564490438,
                  0.480118631,0.254627459,-0.066826163,-0.403483094,-0.731236977,-1.017417700,-1.257708260,-1.415219345,
                  -1.482255888,-1.508902165,-1.483376827,-1.406247346,-1.311364210,-1.200605222,-1.073571089,-0.953039447,
                  -0.831036754,-0.728373201,-0.635724656,-0.551895762,-0.465960586,-0.352769246,-0.234310307,-0.110120880,
                  -0.001584436,0.084985980,0.149633928,0.212791110,0.272268852,0.336799064,0.389949914,0.439442966,
                  0.461760107,0.438179348,0.394221583,0.358642633,0.319058861,0.270242102,0.195946455,0.129087127,0.057843439,
                  -0.006013452,-0.047589165,-0.095808882,-0.181495649,-0.300908023,-0.450070899,-0.597922869,-0.737009845,
                  -0.855458058,-0.989516726,-1.123065569,-1.245223690,-1.336922359,-1.388032279,-1.407462531,-1.432912839,
                  -1.449881353,-1.452891346,-1.449724679,-1.423714951,-1.382739379,-1.325625007,-1.230130001,-1.149262593,
                  -1.074684462,-0.998210542,-0.908924549,-0.809238911,-0.705371973,-0.612030107,-0.530414409,-0.467127250,
                  -0.411302722,-0.367446042,-0.329779757,-0.334075957,-0.383771073,-0.463871903,-0.558906939,-0.646661904,
                  -0.729447136,-0.810648393,-0.899463008,-0.990321102,-1.084999713,-1.172047486,-1.244674642,-1.298910433,
                  -1.333921078,-1.357861653,-1.387704240,-1.421646753,-1.449148787,-1.471156575,-1.470692727,-1.460009369,
                  -1.431359968,-1.399389314,-1.346962743,-1.267383701,-1.136768040,-0.978310253,-0.796316633,-0.599149046,
                  -0.409998002,-0.215910520,-0.037248544,0.094116274,0.196874654,0.267304131,0.308973991,0.336027148,0.324002246,
                  0.272653121,0.208789745,0.127878561,0.030799408,-0.069449890,-0.184237147,-0.330174813,-0.465098064,-0.555242883,
                  -0.599324657,-0.603876560,-0.601939170,-0.576835255,-0.640024650,-0.763645575,-0.925698721,-1.083171717,
                  -1.220242713,-1.316662856,-1.388063274,-1.432486514,-1.411903574,-1.365960246,-1.311767960,-1.252080781,
                  -1.179978374,-1.122697290,-1.063248134,-0.995927085,-0.925017371,-0.827816473,-0.715712732,-0.594322638,
                  -0.483968451,-0.376599622,-0.264661919,-0.148355781,-0.035667415,0.059633407,0.114206561,0.119471993,
                  0.078889303,0.026022120,-0.025606050,-0.093149120,-0.179410208,-0.275625651,-0.369489935,-0.441979904,
                  -0.498157691,-0.543089796,-0.594615849,-0.662765792,-0.741558608,-0.775672453,-0.797089187,-0.781076137,
                  -0.726992089,-0.652061906,-0.546759494,-0.417978570,-0.261523627,-0.097946732,0.073262912,0.250042718,
                  0.402451934,0.540252674,0.654774263,0.779235732,0.886387296,0.969878048,1.030865267,1.045533903,1.043167320,
                  1.043497276,1.051811291,1.073581927];
  var trendyWaysMacd = macd (testData);
  assert.equal (trendyWaysMacd.macd.length, macdTest.length, "MACD values match length");
  for (var i = 0; i < trendyWaysMacd.macd.length; i++)
  {
      assert.deepEqual (trendyWaysMacd.macd[i].toFixed(5), macdTest[i].toFixed(5), "Testing MACD value " + i);
  }
  assert.equal (trendyWaysMacd.signal.length, signalTest.length, "MACD signal values match length");
  for (var i = 0; i < trendyWaysMacd.signal.length; i++)
  {
      assert.deepEqual (trendyWaysMacd.signal[i].toFixed(5), signalTest[i].toFixed(5), "Testing signal value " + i);
  }
  for (var i = 0; i < trendyWaysMacd.hist[i].length; i++)
  {
      assert.deepEqual (trendyWaysMacd.hist[i].toFixed(5), (macdTest[i] - signalTest[i]).toFixed(5), "Testing hist value " + i);
  }
});

/**
 * Momentum function test
 */
it ("Momentum Test", function () {
  var values = [196.35,195.27,193.99,193.14,192.87,192.32,192.88,194.45, 192.62, 192.50];
  var resultOrder1 = [-1.08, -1.28, -0.85, -0.27, -0.55, 0.56, 1.57, -1.83, -0.12];
  var resultOrder3 = [-3.21, -2.4, -1.67, -0.26, 1.58, 0.3, -0.38];
  var momentumValues = momentum (values, 1);
  assert.deepEqual (momentumValues.length, resultOrder1.length,"Momentum order 1 length is ok");
  for (var i = 0; i < momentumValues.length; i++)
  {
    assert.deepEqual (momentumValues[i].toFixed(5), resultOrder1[i].toFixed(5), "Testing value " + i);
  }
  var momentumValues3 = momentum (values, 3);
  assert.deepEqual (momentumValues3.length, resultOrder3.length,"Momentum order 3 length is ok");
  for (var i = 0; i < momentumValues3.length; i++)
  {
    assert.deepEqual (momentumValues3[i].toFixed(5), resultOrder3[i].toFixed(5), "Testing value " + i);
  }
});

/**
 * Rate of Change function test
 */
it ("Rate of Change", function () {
  var values = [196.35,195.27,193.99,193.14,192.87,192.32,192.88,194.45, 192.62, 192.50];
  var resultOrder1 = [-0.00550, -0.00656, -0.00438, -0.001397, -0.00285, 0.00291, 0.00814, -0.00941, -0.00062];
  var resultOrder3 = [-0.016348, -0.01229, -0.008608, -0.0013461, 0.008192046, 0.001559, -0.001970];
  var rocValues = roc (values, 1);
  assert.deepEqual (rocValues.length, resultOrder1.length,"ROC order 1 length is ok");
  for (var i = 0; i < rocValues.length; i++)
  {
    assert.deepEqual (rocValues[i].toFixed(5), resultOrder1[i].toFixed(5), "Testing value " + i);
  }
  var rocValues3 = roc (values, 3);
  assert.deepEqual (rocValues3.length, resultOrder3.length,"ROC order 3 length is ok");
  for (var i = 0; i < rocValues3.length; i++)
  {
    assert.deepEqual (rocValues3[i].toFixed(5), resultOrder3[i].toFixed(5), "Testing value " + i);
  }
});

/**
 * RSI (relative strength index) test
 */
it ("RSI test", function () {
  var values = [44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.10, 45.42,
                45.84, 46.08, 45.89, 46.03, 45.61, 46.28, 46.28, 46.00,
                46.03, 46.41, 46.22, 45.64, 46.21, 46.25, 45.71, 46.45,
                45.78, 45.35, 44.03, 44.18, 44.22, 44.57, 43.42, 42.66, 
                43.13];
  /*var values = [
      46.125, 47.1250, 46.4375, 46.9375, 44.9375, 44.25, 44.625,
      45.75, 47.81, 47.56, 47, 44.56, 46.31, 47.68, 46.68, 45.68,
      43.06, 43.56, 44.87, 43.68
  ];*/
  var expected = [70.46, 66.24, 66.48, 69.34, 66.29, 57.91, 62.88, 63.20,
                  56.01, 62.33, 54.67, 50.38, 40.01, 41.49, 41.9, 45.49,
                  37.32, 33.09, 37.78];
  /*var expected = [
    51.779, 48.477, 41.073, 42.863, 47.382, 43.992 
  ];*/
  var result = rsi (values, 14);
  assert.deepEqual (result.length, expected.length, "RSI result length matches");
  for (var i = 0; i < result.length; i++)
  {
    assert.deepEqual (result[i].toFixed(1), expected[i].toFixed(1), "RSI value " + i + " matches");
  }
});
it ("Floor pivot level, supports and resistances", function () {
  var lowList = [5];
  var highList = [18];
  var closeList = [15];
  var values = floorPivots (highList, lowList, closeList);
  assert.deepEqual (values[0].r3, 33.33333333333333, "Resistance R3 ok");
  assert.deepEqual (values[0].r2, 25.666666666666664, "Resistance R2 ok");
  assert.deepEqual (values[0].r1, 20.333333333333332, "Resistance R1 ok");
  assert.deepEqual (values[0].pl, 12.666666666666666, "Pivot level ok");
  assert.deepEqual (values[0].s1, 7.333333333333332, "Support R1 ok");
  assert.deepEqual (values[0].s2, -0.3333333333333339, "Support R2 ok");
  assert.deepEqual (values[0].s3, -5.666666666666668, "Support R3 ok");
});

it ("Tom Demarks's predicted low and high value (support and resistance)", function () {
  var highList = [10, 15, 25];
  var lowList = [5, 8, 10];
  var openList = [6, 10, 17];
  var closeList = [7, 11, 12];
  var values = tomDemarksPoints (highList, lowList, openList, closeList);
  assert.deepEqual (values.length, 3, "Returned values ok");
  // first predicted values
  assert.deepEqual (values[0].low, 6 , "Support for first value ok");
  assert.deepEqual (values[0].high, 11, "Resistance for first value ok");
  // second predicted values
  assert.deepEqual (values[1].low, 9.5, "Support for second value  ok");
  assert.deepEqual (values[1].high, 16.5, "Resistance for second value ok");
  // third predicted values
  assert.deepEqual (values[2].low, 3.5, "Support for third value ok");
  assert.deepEqual (values[2].high, 18.5, "Resistance for third value ok");
});

it ("Woodies predicted points (support and resistance)", function () {
  var highList = [10, 15, 25, 10];
  var lowList = [5, 8, 10, 8];
  var closeList = [7, 11, 12, 9];
  var values = woodiesPoints (highList, lowList, closeList);
  assert.deepEqual (values.length, 4, "Returned values ok");
  // first predicted values
  assert.deepEqual (values[0].pivot, 7.25, "Pivot for first value ok");
  assert.deepEqual (values[0].r1, 9.5, "Resistance for first value ok");
  assert.deepEqual (values[0].r2, 12.25, "Resistance for first value ok");
  assert.deepEqual (values[0].s1, 4.5, "Resistance for first value ok");
  assert.deepEqual (values[0].s2, 2.25, "Resistance for first value ok");
  // second predicted values
  assert.deepEqual (values[1].pivot, 11.25, "Pivot for second value ok");
  assert.deepEqual (values[1].r1, 14.5, "Resistance for second value ok");
  assert.deepEqual (values[1].r2, 18.25, "Resistance for second value ok");
  assert.deepEqual (values[1].s1, 7.5, "Resistance for second value ok");
  assert.deepEqual (values[1].s2, 4.25, "Resistance for second value ok");
  // third predicted values
  assert.deepEqual (values[2].pivot, 14.75, "Pivot for third value ok");
  assert.deepEqual (values[2].r1, 19.5, "Resistance for third value ok");
  assert.deepEqual (values[2].r2, 29.75, "Resistance for third value ok");
  assert.deepEqual (values[2].s1, 4.5, "Resistance for third value ok");
  assert.deepEqual (values[2].s2, -0.25, "Resistance for third value ok");
  // fourth predicted values
  assert.deepEqual (values[3].pivot, 9, "Pivot for fourth value ok");
  assert.deepEqual (values[3].r1, 10, "Resistance for fourth value ok");
  assert.deepEqual (values[3].r2, 11, "Resistance for fourth value ok");
  assert.deepEqual (values[3].s1, 8, "Resistance for fourth value ok");
  assert.deepEqual (values[3].s2, 7, "Resistance for fourth value ok");
});

it ("Camarilla predicted points (supports and resistances)", function () {
  var highList = [10, 15, 25, 10];
  var lowList = [5, 8, 10, 8];
  var closeList = [7, 11, 12, 9];
  var values = camarillaPoints (highList, lowList, closeList);
  assert.deepEqual (values.length, 4, "Returned values ok");
  // first predicted values
  assert.deepEqual (values[0].r1, 7.458333333333333, "Resistance r1 for first value ok");
  assert.deepEqual (values[0].r2, 7.916666666666667, "Resistance r2 for first value ok");
  assert.deepEqual (values[0].r3, 8.375, "Resistance r3 for first value ok");
  assert.deepEqual (values[0].r4, 9.75, "Resistance r4 for first value ok");
  assert.deepEqual (values[0].s1, 6.541666666666667, "Support s1 for first value ok");
  assert.deepEqual (values[0].s2, 6.083333333333333, "Support s2 for first value ok");
  assert.deepEqual (values[0].s3, 5.625, "Support s3 for first value ok");
  assert.deepEqual (values[0].s4, 4.25, "Support s4 for first value ok");
  // second predicted values
  assert.deepEqual (values[1].r1, 11.641666666666667, "Resistance r1 for second value ok");
  assert.deepEqual (values[1].r2, 12.283333333333333, "Resistance r2 for second value ok");
  assert.deepEqual (values[1].r3, 12.925, "Resistance r3 for second value ok");
  assert.deepEqual (values[1].r4, 14.850000000000001, "Resistance r4 for second value ok");
  assert.deepEqual (values[1].s1, 10.358333333333333, "Support s1 for second value ok");
  assert.deepEqual (values[1].s2, 9.716666666666667, "Support s2 for second value ok");
  assert.deepEqual (values[1].s3, 9.075, "Support s3 for second value ok");
  assert.deepEqual (values[1].s4, 7.1499999999999995, "Support s4 for second value ok");
  // third predicted values 
  assert.deepEqual (values[2].r1, 13.375, "Resistance r1 for third value ok");
  assert.deepEqual (values[2].r2, 14.75, "Resistance r2 for third value ok");
  assert.deepEqual (values[2].r3, 16.125, "Resistance r3 for third value ok");
  assert.deepEqual (values[2].r4, 20.25, "Resistance r4 for third value ok");
  assert.deepEqual (values[2].s1, 10.625, "Support s1 for third value ok");
  assert.deepEqual (values[2].s2, 9.25, "Support s2 for third value ok");
  assert.deepEqual (values[2].s3, 7.875, "Support s3 for third value ok");
  assert.deepEqual (values[2].s4, 3.75, "Support s4 for third value ok");
  // fourth predicted values
  assert.deepEqual (values[3].r1, 9.183333333333334, "Resistance r1 for fourth value ok");
  assert.deepEqual (values[3].r2, 9.366666666666667, "Resistance r2 for fourth value ok");
  assert.deepEqual (values[3].r3, 9.55, "Resistance r3 for fourth value ok");
  assert.deepEqual (values[3].r4, 10.1, "Resistance r4 for fourth value ok");
  assert.deepEqual (values[3].s1, 8.816666666666666, "Support s1 for fourth value ok");
  assert.deepEqual (values[3].s2, 8.633333333333333, "Support s2 for fourth value ok");
  assert.deepEqual (values[3].s3, 8.45, "Support s3 for fourth value ok");
  assert.deepEqual (values[3].s4, 7.9, "Support s4 for fourth value ok");
});

it ("Fibonacci retracement uptrend ([5,8,7,6,9], [10,12,9,15,16], 'UPTREND')", function ()
{
  var highList = [10, 12, 9, 15, 16];
  var lowList = [5, 8, 7, 6, 9];
  var values = fibonacciRetrs (lowList, highList, 'UPTREND');
  assert.deepEqual (values.length, 5, "Returned values ok");
  for (var i = 0; i < values.length; i++)
  {
    assert.deepEqual (values[i].length, 6, "Values in pos " + i + " ok");
  }
  var solsUptrend = [[10, 8.09, 7.5, 6.91, 6.18, 5],
             [12, 10.47, 10, 9.53, 8.94, 8],
             [9, 8.24, 8, 7.76, 7.47, 7],
             [15, 11.56, 10.50, 9.44, 8.12, 6],
             [16, 13.33, 12.50, 11.67, 10.65, 9]];
  var retracement = [100, 61.8, 50, 38.2, 23.6, 0]; // only for the text output
  for (var i = 0; i < 5; i++)
  {
    for (var j = 0; j < 6; j++)
    {
      assert.deepEqual (values[i][j].toFixed(2), solsUptrend[i][j].toFixed(2), "test " + i + " uptrend, " + retracement[j] + "% retracement OK");
    }
  }
});

it ("Fibonacci retracement downtrend ([10,9,5,7,2], [5,6,3,6,1], 'DOWNTREND')", function ()
{
  var highList = [10, 9, 5, 7, 2];
  var lowList = [5, 6, 3, 6, 1];
  var values = fibonacciRetrs (lowList, highList, 'DOWNTREND');
  assert.deepEqual (values.length, 5, "Returned values ok");
  for (var i = 0; i < values.length; i++)
  {
    assert.deepEqual (values[i].length, 6, "Values in pos " + i + " ok");
  }
  var solsDownTrend = [[5, 6.91, 7.5, 8.09, 8.82, 10],
             [6, 7.15, 7.5, 7.85, 8.29, 9],
             [3, 3.76, 4, 4.24, 4.53, 5],
             [6, 6.38, 6.5, 6.62, 6.76, 7],
             [1, 1.38, 1.5, 1.62, 1.76, 2]];
  var retracement = [100, 61.8, 50, 38.2, 23.6, 0]; // only for the text output
  for (var i = 0; i < 5; i++)
  {
    for (var j = 0; j < 6; j++)
    {
      assert.deepEqual (values[i][j].toFixed(2), solsDownTrend[i][j].toFixed(2), "test " + i + " downtrend, " + retracement[j] + "% retracement OK");
    }
  }
});

});
