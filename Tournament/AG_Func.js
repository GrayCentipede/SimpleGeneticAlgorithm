function genSize(lowerLim, upperLim, decimals) // Función que se utilizara para saber el tamaño del cromosoma
{ 
	return Math.ceil( Math.log2( (upperLim - lowerLim) * Math.pow(10,decimals) ) );
}

function mathematicalFunction(x,y){
	return ( 21.5 + (x * Math.sin(4 * Math.PI * x)) + (y * Math.sin(20 * Math.PI * y)) );
}

function fitness(individuals, xl, xu, yl, yu, size, xSize)
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

		fitness[x] = mathematicalFunction(xi,yi);
		fitness[x] = fitness[x].toFixed(4);
	}

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

function selection(individuals, individualsFitness){

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