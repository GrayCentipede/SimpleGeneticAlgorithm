var decimals = 4, maxGenerations = 100, populSize = 25, PC = 0.75, PM = 0.015;
var xl, xu, yl, yu, xSize, ySize, chromosomeSize;		


function set(func)
{
	if (func== "test")
		xl = -3, xu = 12.1, yl = -4.1, yu = 5.8; //Función prueba		

	if (func== "rastrigin")
		xl = -5.12, xu = 5.12, yl = -5.12, yu = 5.12; // Rastrigin

	if (func== "ackley" || func == "styblinski")
		xl = -5, xu = 5, yl = -5, yu = 5; //Ackley
		

	if (func== "sphere" || func== "rosenbrock" || func== "booth" || func== "levi" || func== "cross")
		xl = -10, xu = 10, yl = -10, yu = 10; //Esfera, Rosenbrock, Booth, Levi, Cross in tray 

	if (func== "baele")
		xl = -4.5, xu = 4.5, yl = -4.5, yu = 4.5; //Baele

	if (func== "goldstein")
		xl = -2, xu = 2, yl = -2, yu = 2; //Función Goldstein-Price
		
	if (func== "easom" || func == "schaffer")
		xl = -100, xu = 100, yl = -100, yu = 100; //Easom *
		

	if (func== "egg")
		xl = -512, xu = 512, yl = -512, yu = 512; //Eggholder *

	xSize = genSize(xl,xu,decimals);
	ySize = genSize(yl,yu,decimals);

	chromosomeSize = xSize + ySize;

	console.log("Tamaño de X: "+xSize+"\nTamaño de Y: "+ySize+"\nTamaño del cromosoma: "+chromosomeSize);		
}

function shuffle(array)
{
  var currentIndex = array.length, temporaryValue, randomIndex;

  // Mientras todavía queden elementos que desordenar
  while (0 !== currentIndex) 
  {

    // Escoge un elemento
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; 

    // Y lo intercambia con el actual
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function genSize(lowerLim, upperLim, decimals) // Función que se utilizara para saber el tamaño del cromosoma
{ 
	return Math.ceil( Math.log2( (upperLim - lowerLim) * Math.pow(10,decimals) ) );
}

function testFunction(x,y,type)
{
	var f = ( 21.5 + (x * Math.sin(4 * Math.PI * x)) + (y * Math.sin(20 * Math.PI * y)) );
	if (type==1)
		return f;
	else
		return ( 1 / f );
}

function rastriginFunction(x,y,type)
{
	var A = 10, n= 2, sum = 0;

	for (var z = 1; z<=n; z++)
	{
		sum += Math.pow(x,2) - ( A * Math.cos(2*Math.PI*x) );
	}

	var f = (A*n) + sum + 1;

	if (type==1)
		return f;
	else
		return (1/f);
}

function ackleyFunction(x,y,type) 
{
	var f = ( -20 * Math.exp( -0.2 * Math.sqrt( 0.5 * (Math.pow(x,2) + Math.pow(y,2) ) ) ) ) - Math.exp( 0.5 * ( Math.cos( 2 * Math.PI * x) + Math.cos( 2 * Math.PI * y ) ) ) + Math.E + 20 + 1;
	if (type == 1)
		return f;
	else
		return 1/ f;
}

function sphereFunction(x,y,type)
{
	var f = 0, n=2;
	for (var z = 1; z<=n; z++)
	{
		f += Math.pow(x,2);
	}

	if (type == 1)
		return f;
	else
		return 1/ f;

}

function rosenbrockFunction(x,y,type)
{
	var f = 0, n = 2;
	for (z = 1; z<=(n-1); z++)
		f += 100 * Math.pow( (x - Math.pow(x,2)) , 2) + Math.pow((x-1),2);

	f++;

	if (type == 1)
		return f;
	else
		return 1/ f;
}

function baeleFunction(x,y,type)
{
	var f = Math.pow((1.5 - x + (x*y) ),2) + Math.pow( (2.25 - x + ( x * Math.pow(y,2) ) ), 2 ) + Math.pow( (2.625 - x + ( x * Math.pow(y,3) ) ) , 2) + 1;

	if (type == 1)
		return f;
	else
		return 1/ f;
}

function goldsteinFunction(x,y,type)
{
	var f = ( 1 + ( Math.pow( (x+y+1) , 2) ) * (19 -(14*x) + (3 * Math.pow(x,2)) - (14*y) + (6*x*y) + (3 * Math.pow(y,2) ) ) ) * ( 30 + Math.pow( ( (2*x) - (3*y) ) , 2 ) * ( 18 - (32*x) + ( 12 * Math.pow(x,2) ) + (48 * y) - (36*x*y) + (27*Math.pow(y,2) ) ) );

	if (type == 1)
		return f;
	else
		return 1 / f;
}

function boothFunction(x,y,type)
{
	var f = Math.pow( (x+(2*y)-7) , 2) + Math.pow( ( (2*x)+y-5 ), 2 ) + 1;

	if (type == 1)
		return f;
	else
		return 1/ f;
}

function leviFunction(x,y,type)
{
	var f = Math.pow( Math.sin(3*Math.PI*x) , 2 ) + Math.pow( (x-1) , 2 ) * (1 + Math.pow( (Math.sin(3*Math.PI*y)), 2) ) + Math.pow( (y-1) , 2) * ( 1 + Math.pow(Math.sin(2*Math.PI*y)), 2 );
	f++;

	if (type == 1)
		return f;
	else
		return 1/ f;		
}

function easomFunction(x,y,type)
{
	var f = -Math.cos(x)*Math.cos(y)*Math.exp(-( Math.pow( (x-Math.PI) , 2) + Math.pow( (y-Math.PI) , 2) ));
	f++;

	console.log(x,y);

	if (type == 1)
		return f;
	else
		return 1/ f;
}

function crossFunction(x,y,type)
{
	var f = ( -0.0001 * Math.pow( ( Math.abs(Math.sin(x) * Math.sin(y) * Math.exp( Math.abs( 100 - ((Math.sqrt(Math.pow(x,2) + Math.pow(y,2))) / Math.PI)) ) + 1 ) ), 0.1) ) + 3;
	
	if (type == 1)
		return f;
	else
		return 1/ f;	
}

function eggholderFunction(x,y,type)
{	
	var f = -(y+47) * Math.sin(Math.sqrt(Math.abs( (x/2) + (y+47) ))) - x*Math.sin(Math.sqrt(Math.abs(x-(y+47)))) + 960;
	if (type == 1)
		return f;
	else
		return 1/ f;		
}

function schafferFunction(x, y, type)
{
	var f = 0.5 + ( (Math.pow((Math.sin(Math.abs( Math.pow(x,2) - Math.pow(y,2) ))),2) - 0.5) / (Math.pow((1+0.0001*(Math.pow(x,2)+Math.pow(y,2))), 2)) );
	
	if (type == 1)
		return f;
	else
		return 1/ f;			
}

function styblinskiFunction(x,y, type)
{
	var f = 0, n=2;

	for (z = 1; z<=n; z++)
	{
		f += Math.pow(x,4) - (16 * Math.pow(x,2)) + (5*x); 
	}

	f /= 2;

	f+=40;

	if (type == 1)
		return f;
	else
		return 1/ f;			
}

function fitness(individuals, type, mathFunction)
{
	var fitness = [], genX = [], genY = [];

	var xDecimal, yDecimal;

	for (x in individuals)
	{
		for(y=0; y<xSize; y++)
			genX[y] = individuals[x][y];

		for(z=xSize; z<chromosomeSize; z++)
			genY[z] = individuals[x][z];

		xDecimal = parseInt( genX.join("") , 2);
		yDecimal = parseInt( genY.join("") , 2);

		xi = xl + ( xDecimal * ( (xu - xl) / ( Math.pow(2,xSize) - 1 ) ) );
		yi = yl + ( yDecimal * ( (yu - yl) / ( Math.pow(2,ySize) - 1 ) ) );

		fitness[x] = mathFunction(xi,yi,type);
	}

	return fitness;
}

function bFitness(individuals, type, mathFunction)
{
	var fitness = [], genX = [], genY = [];

	var xDecimal, yDecimal;

	for(x=0; x<xSize; x++)
		genX[x] = individuals[x];

	for(y=xSize; y<chromosomeSize; y++)
		genY[y] = individuals[y];

	xDecimal = parseInt( genX.join("") , 2);
	yDecimal = parseInt( genY.join("") , 2);

	xi = xl + ( xDecimal * ( (xu - xl) / ( Math.pow(2,xSize) - 1 ) ) );
	yi = yl + ( yDecimal * ( (yu - yl) / ( Math.pow(2,ySize) - 1 ) ) );

	fitness = mathFunction(xi,yi,type);

	return fitness;
}

function populationFitness(fitness)
{
	var generalFitness = 0;

	for (x in fitness)
		generalFitness += fitness[x];

	return generalFitness;
}

function relative(fitness, generalFitness)
{
	var relative = [];

	for(x in fitness)
		relative[x] = (fitness[x] / generalFitness);

	return relative;
}

function bRelative(fitness, generalFitness)
{
	var relative = (fitness / generalFitness);

	return relative;
}

function selection(individuals, relativeFitness){

	//El proceso de selección que se usará aquí sera el llamado: Método de la ruleta 

	var accumulatedFitnessTotal = 0, randomNum, y, z=0;

	var selectedOnes = [], accumulatedFitness = [];

	var selected;


	for (x in individuals) //Se genera una aptitud acumulada
	{

		accumulatedFitnessTotal += parseFloat(relativeFitness[x]);
		accumulatedFitness[x] = accumulatedFitnessTotal;
	}

	console.log(accumulatedFitnessTotal);

	for (x in individuals) //Se generan n cantidad de numeros aleatorios; donde n = Número de Ind.
	{
		//console.log("--------------------Selección----------------------");
		y=0;
		selected = false;
		randomNum = Math.random();

		do //Individuo por individuo se va checando que el número generado sea menor o mayor que la aptitud acumulada que tiene
		{
			//console.log("Comprobando que "+ (randomNum*100) + "% sea menor que "+ (accumulatedFitness[y])*100+"%");

			if (randomNum <= accumulatedFitness[y])
			{
				//console.log("Verdadero, el individuo: "+ parseInt(y+1) +" ha sido seleccionado");
				selectedOnes[z] = individuals[y]
				z++;
				selected = true;
			}
			else
			{
				//console.log("Falso");
				if (y == (individuals.length-1))
				{
					console.log("Bankrupt");
					selectedOnes[z] = individuals[y]
					z++;
					selected = true;
				}
				y++;
			}

		} while(selected != true && y != individuals.length);
	}

	return selectedOnes;

}

function selectionTournament(individuals, individualsFitness){

	//El proceso de selección que se usará aquí sera el llamado: Método del Torneo con Permutación

	var selectedOnes = [];
	var randomNum;

	for (x in  individuals)
	{
		randomNum = Math.floor(Math.random() * individuals.length);
		console.log( "Individuo "+ (parseInt(x)+1) +" competira con el individuo "+ (randomNum+1) );
		if (individualsFitness[x] >= individualsFitness[randomNum]){
			console.log("Paso el individuo " + (parseInt(x)+1));
			selectedOnes[x] = individuals[x];
		}
		else{
			console.log("Paso el individuo " + (randomNum+1));
			selectedOnes[x] = individuals[randomNum];
		}
	}

	return selectedOnes;

}

function selectionClassicTournament(individuals, individualsFitness)
{

	//El proceso de selección que se usará aquí sera el llamado: Método del Torneo.

	var selectedOnes = [], competitors=[], randomizedOnes = [];
	var randomNum;

	randomizedOnes = individualsFitness.slice(0);

	randomizedOnes = shuffle(randomizedOnes);

	for (x in randomizedOnes)
		for (y in individualsFitness)
			if (randomizedOnes[x] == individualsFitness[y])
				competitors[x] = y;

	for ( x in competitors)
		console.log(competitors[x]);

	for (x in individualsFitness)
	{
		console.log("Individuo " + (parseInt(x)+1) + " v.s. Individuo "+ (parseInt(competitors[x])+1) );
		if (individualsFitness[x] >= individualsFitness[competitors[x]]){
			console.log("Individuo "+ (parseInt(x)+1) +" ganó");
			selectedOnes[x] = individuals[x]; 
		}
		else{
			console.log("Individuo "+ (parseInt(competitors[x])+1) +" ganó");
			selectedOnes[x] = individuals[competitors[x]];
		}
	}

	return selectedOnes;

}

function crossover(selectedOnes, PC)
{
	//En el proceso de la cruza se llevo a cabo el método de cruza por un solo punto
	var randomNum, y=0, z = 0, n=0, size;
	var chosenOnes = [], chromosome = [], mimicryX = [], mimicryY = [];

	for (x in selectedOnes)
	{
		chromosome[x] = selectedOnes[x].slice(0);
	}

	size = chromosome[0].length;

	//Se realiza la cruza entre cromosomas, siempre y cuando haya parejas, en caso de que no haya el cromosoma restante pasa sin haber sido cruzado
	while(y < Math.floor(chromosome.length/2))
	{	
		//console.log("------------------------Cruza-----------------------");

		//Se genera un número aleatorio y dependiendo de si este número es menor a la Probablididad de cruza se escogera a la pareja para que se crucen
		randomNum = Math.random();

		if ( randomNum <= PC )
		{
			//console.log("Cruza ocurre entre el individuo: "+ (parseInt(chosenOnes[n])+1) +" y el individuo "+ (parseInt(chosenOnes[n+1])+1) );
			
			//Se generará un número aleatorio que indicará desde donde será cortada la cadena de bits
			randomNum = Math.floor(Math.random() * (size-1)) + 1;

			//console.log("Numero elegido: "+ randomNum);

			//console.log("Cromosomas orginales: \n"+ chromosome[chosenOnes[n]].join("")+"\n"+chromosome[chosenOnes[n+1]].join(""));

			//Se cortan los respectivos trozos de la cadena y se guardan en las variables temporales mimicry 
			mimicryX = chromosome[chosenOnes[n]].splice(randomNum);
			mimicryY = chromosome[chosenOnes[n+1]].splice(randomNum);

			/*Intercambio de Bits 
			Se crea una variable temporal que almacene los datos de X */
			var temporal = mimicryX;

			// X toma todos los elementos/bits de Y 
			mimicryX = mimicryY;

			// Y toma todos los elementos/bits de temporal la cual tiene los datos de X 
			mimicryY = temporal;

			//Se reorganizan los cromosomas
			chromosome[chosenOnes[n]] = chromosome[chosenOnes[n]].concat(mimicryX);
			chromosome[chosenOnes[n+1]] = chromosome[chosenOnes[n+1]].concat(mimicryY);
		}

			//console.log("Cromosomas alterados: \n"+ chromosome[chosenOnes[n]].join("")+"\n"+chromosome[chosenOnes[n+1]].join(""));

		n += 2;
		y++;

		//Fin de la cruza entre parejas
	}
	
	return chromosome;
}

function crossoverUni(selectedOnes, PC)
{
	//El método de cruza que se usará será el Uniforme
	var randomNum, n=0, z=0, y=0;
	var chosenOnes=[], chromosome = [], mask = [];

	for (x in selectedOnes[0])
	{
		randomNum = Math.random();
		if (randomNum >= 0.5)
			mask[x] = 1;
		else
			mask[x] = 0;
	}

	//console.log("Mascara: \n"+mask.join(""));

	for (x in selectedOnes)
	{
		chromosome[x] = selectedOnes[x].slice(0);
	}

	//console.log(Math.floor(chromosome.length/2));

	//Se realiza la cruza entre cromosomas, siempre y cuando haya parejas, en caso de que no haya el cromosoma restante pasa sin haber sido cruzado
	while( y < Math.floor(chromosome.length/2) )
	{	
		//console.log("------------------------Cruza-----------------------");

		randomNum = Math.random();

		if (randomNum <= PC)
		{
			//console.log("Cruza ocurre entre el individuo: "+ n +" y el individuo "+ (n+1) );

			//console.log("Cromosomas orginales: \n"+ chromosome[n].join("")+"\n"+chromosome[n+1].join("") );

			for (x in mask)
			{
				if (mask[x] == 1)
				{
					var a = chromosome[n][x];
					chromosome[n][x] = chromosome[n+1][x];
					chromosome[n+1][x] = a;
				}
			}
			//Se cortan los respectivos trozos de la cadena y se guardan en las variables temporales mimicry 

			//console.log("Cromosomas alterados: \n"+ chromosome[n].join("")+"\n"+chromosome[n+1].join("") );
		}

		n += 2;
		y++;

		//Fin de la cruza entre parejas
	}
	
	return chromosome;
}

function mutation(individuals, PM)
{
	//console.log("----------------------Mutación------------------------");

	var randomNum;

	for (x in individuals)
	{

		for (y in individuals[x])
		{
			randomNum = Math.random();

			if (randomNum <= PM)
			{
				//console.log("Mutó el individuo "+ (parseInt(x)+1) +" en el bit número: "+ (parseInt(y)+1) );

				if (individuals[x][y] == 1)
					individuals[x][y] = 0;
				else
					individuals[x][y] = 1
			}

		}

	}

	return individuals;
}