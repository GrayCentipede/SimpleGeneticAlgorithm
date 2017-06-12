var xl = -3, xu = 12.1, yl = 4.1, yu = 5.8, decimals = 4, maxGenerations = 500, populSize = 50, PC = 0.75, PM = 0.015;

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

function mathematicalFunction(x,y,type)
{
	if (type==1)
		return ( 21.5 + (x * Math.sin(4 * Math.PI * x)) + (y * Math.sin(20 * Math.PI * y)) );
	else
		return ( -(21.5 + (x * Math.sin(4 * Math.PI * x)) + (y * Math.sin(20 * Math.PI * y))) );
}

function fitness(individuals, xl, xu, yl, yu, size, xSize, type)
{
	var fitness = [], genX = [], genY = [];

	var xDecimal, yDecimal;

	for (x in individuals)
	{
		for(y=0; y<xSize; y++)
			genX[y] = individuals[x][y];

		for(z=xSize; z<size; z++)
			genY[z] = individuals[x][z];

		xDecimal = parseInt( genX.join("") , 2);
		yDecimal = parseInt( genY.join("") , 2);

		xi = xl + ( xDecimal * ( (xu - xl) / ( Math.pow(2,xSize) - 1 ) ) );
		yi = yl + ( yDecimal * ( (yu - yl) / ( Math.pow(2,ySize) - 1 ) ) );

		fitness[x] = mathematicalFunction(xi,yi,type);
		fitness[x] = fitness[x].toFixed(4);
	}

	return fitness;
}

function bFitness(individuals, xl, xu, yl, yu, size, xSize, type)
{
	var fitness = [], genX = [], genY = [];

	var xDecimal, yDecimal;

	for(x=0; x<xSize; x++)
		genX[x] = individuals[x];

	for(y=xSize; y<size; y++)
		genY[y] = individuals[y];

	xDecimal = parseInt( genX.join("") , 2);
	yDecimal = parseInt( genY.join("") , 2);

	xi = xl + ( xDecimal * ( (xu - xl) / ( Math.pow(2,xSize) - 1 ) ) );
	yi = yl + ( yDecimal * ( (yu - yl) / ( Math.pow(2,ySize) - 1 ) ) );

	fitness = mathematicalFunction(xi,yi,type);
	fitness = fitness.toFixed(4);

	return fitness;
}

function populationFitness(fitness)
{
	var generalFitness = 0;

	for (x in fitness)
		generalFitness += parseInt(fitness[x]);

	return generalFitness;
}

function relative(fitness, generalFitness)
{
	var relative = [];

	for(x in fitness)
		relative[x] = (fitness[x] / generalFitness).toFixed(4);

	return relative;
}

function bRelative(fitness, generalFitness)
{
	var relative = (fitness / generalFitness).toFixed(4);

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
	console.log(individuals.length);

	for (x in individuals) //Se generan n cantidad de numeros aleatorios; donde n = Número de Ind.
	{
		//console.log("--------------------Selección----------------------");
		y=0;
		selected = false;
		randomNum = Math.random();

		do //Individuo por individuo se va checando que el número generado sea menor o mayor que la aptitud acumulada que tiene
		{
			//console.log("Comprobando que "+ randomNum.toFixed(4) + " sea menor que "+ accumulatedFitness[y]);

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

	//El proceso de selección que se usará aquí sera el llamado: Método del torneo

	var selectedOnes = [];
	var randomNum;

	for (x in  individuals)
	{
		randomNum = Math.floor(Math.random() * individuals.length);
		//console.log("Individuo "+ (x+1) +" competira con el individuo "+ (randomNum+1);
		if (individualsFitness[x] >= individualsFitness[randomNum])
			selectedOnes[x] = individuals[x];
		else
			selectedOnes[x] = individuals[randomNum];
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

	for (x in individualsFitness)
	{
		if (individualsFitness[x] >= individualsFitness[competitors[x]])
			selectedOnes[x] = individuals[x]; 
		else
			selectedOnes[x] = individuals[competitors[x]];
	}

	return selectedOnes;

}

function crossover(selectedOnes, PC)
{
	//En el proceso de la cruza se llevo a cabo el método de cruza por un solo punto
	var randomNum, y=0, z = 0, n=0, size;
	var chosenOnes = [], chromosome = [], mimicryX = [], mimicryY = [];

	//Se genera un número aleatorio y dependiendo de si este número es menor a la Probablididad de cruza se escogera al individuo
	for (x in selectedOnes)
	{
		randomNum = Math.random();
		if (randomNum <= PC)
		{
			//De los individuos que se seleccionen se guardará la localidad que tienen para seguir teniendo un orden con los individuos
			//console.log("Individuo "+ (parseInt(x)+1) +" ha sido elegido");
			chosenOnes[z] = x;
			z++;
		}

	}

	//console.log(chosenOnes);
	for (x in selectedOnes)
	{
		chromosome[x] = selectedOnes[x].slice(0);
	}

	size = chromosome[0].length;

	//Se realiza la cruza entre cromosomas, siempre y cuando haya parejas, en caso de que no haya el cromosoma restante pasa sin haber sido cruzado
	while(y < Math.floor(chosenOnes.length/2))
	{	
		//console.log("------------------------Cruza-----------------------");
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

		//console.log("Cromosomas alterados: \n"+ chromosome[chosenOnes[n]].join("")+"\n"+chromosome[chosenOnes[n+1]].join(""));

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