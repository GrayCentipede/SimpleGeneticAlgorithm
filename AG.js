/*Implementación de un Algoritmo Genético en JS
Hecho por Mauricio Carrasco Ruiz
Problema: 
Maximizar la función f(x,y) = 21.5 + x*sen(4*PI*x) + y*sen(20*PI*y)
Con los siguientes rangos: x=[-3.0,12.1] e y=[4.1,5.8]
Se desea una precisión de 4 decimales 

Características del AG:
Generaciones: 2
Tamaño de la población: 5
Probabilidad de Cruza: 0.75
Probabilidad de Mutación: 0.015 

PASOS A SEGUIR PARA UN AG

1. Generar una población inicial

1.1 Codificación de las variables */

var xl = -3, xu = 12.1, yl = 4.1, yu = 5.8, decimals = 4, generation = 0, maxGenerations = 2, populSize = 5, generalFitness = 0, PC = 0.75, PM = 0.015, xi, yi, size;

var individuals = [], chromosome = [], individualsFitness = [], relativeFitness = [], selectedOnes = [], heirs;

function genSize(lowerLim, upperLim, decimals) // Función que se utilizara para saber el tamaño del cromosoma
{ 
	return Math.ceil( Math.log2( (upperLim - lowerLim) * Math.pow(10,decimals) ) );
}

function mathematicalFunction(x,y){
	return ( 21.5 + (x * Math.sin(4 * Math.PI * x)) + (y * Math.sin(20 * Math.PI * y)) );
}

function selection(individuals, relativeFitness){

	//El proceso de selección que se usará aquí sera el llamado: Método de la ruleta 

	var accumulatedFitnessTotal = 0, randomNum, y, z=0;

	var selectedOnes = [], accumulatedFitness = [];

	var selected;

	for (x in individuals) //Se genera una aptitud acumulada
	{

		accumulatedFitnessTotal += relativeFitness[x];
		accumulatedFitness[x] = accumulatedFitnessTotal;

	}

	for (x in individuals) //Se generan n cantidad de numeros aleatorios; donde n = Número de Ind.
	{
		console.log("--------------------Selección----------------------");
		y=0;
		selected = false;
		randomNum = Math.random();

		do //Individuo por individuo se va checando que el número generado sea menor o mayor que la aptitud acumulada que tiene
		{
			console.log("Comprobando que "+ randomNum.toFixed(4) + " sea menor que "+ accumulatedFitness[y].toFixed(4));

			if (randomNum < accumulatedFitness[y])
			{
				console.log("Verdadero, el individuo: "+ parseInt(y+1) +" ha sido seleccionado");
				selectedOnes[z] = individuals[y]
				z++;
				selected = true;
			}
			else
			{
				console.log("Falso");
				y++;
			}

		} while(selected != true && y != individuals.length);
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
			console.log("Individuo "+ (parseInt(x)+1) +" ha sido elegido");
			chosenOnes[z] = x;
			z++;
		}

		chromosome[x] = selectedOnes[x][0].concat(selectedOnes[x][1]);
	}

	size = chromosome[0].length;

	//Se realiza la cruza entre cromosomas, siempre y cuando haya parejas, en caso de que no haya el cromosoma restante pasa sin haber sido cruzado
	while(y < Math.floor(chosenOnes.length/2))
	{	
		console.log("------------------------Cruza-----------------------");
		console.log("Cruza ocurre entre el individuo: "+ (parseInt(chosenOnes[n])+1) +" y el individuo "+ (parseInt(chosenOnes[n+1])+1) );
		
		//Se generará un número aleatorio que indicará desde donde será cortada la cadena de bits
		randomNum = Math.floor(Math.random() * (size-1)) + 1;

		console.log("Numero elegido: "+ randomNum);

		console.log("Cromosomas orginales: \n"+ chromosome[chosenOnes[n]].join("")+"\n"+chromosome[chosenOnes[n+1]].join(""));

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

		console.log("Cromosomas alterados: \n"+ chromosome[chosenOnes[n]].join("")+"\n"+chromosome[chosenOnes[n+1]].join(""));

		n += 2;
		y++;

		//Fin de la cruza entre parejas
	}

	return chromosome;
}

function mutation(individuals, PM)
{
	console.log("----------------------Mutación------------------------");

	var randomNum;

	for (x in individuals)
	{

		for (y in individuals[x])
		{
			randomNum = Math.random();

			if (randomNum <= PM)
			{
				console.log("Mutó el individuo "+ (parseInt(x)+1) +" en el bit número: "+ (parseInt(y)+1) );

				if (individuals[x][y] == 1)
					individuals[x][y] = 0;
				else
					individuals[x][y] = 1
			}

		}

	}

	return individuals;
}

// 1.0 Algoritmo Genético Básico

xSize = genSize(xl,xu,decimals);
ySize = genSize(yl,yu,decimals);

var chromosomeSize = xSize + ySize


console.log("Tamaño de X: "+xSize+"\nTamaño de Y: "+ySize+"\nTamaño del cromosoma: "+chromosomeSize);

//1.2 Generar a la población inicial

for (var x=0; x<populSize; x++)
{
	individuals[x] = ["x","y"];
	individuals[x][0] = [];
	individuals[x][1] = [];
	for(y=0; y<2; y++){

		if (y==0)
			size = xSize;
		else 
			size = ySize;

 		for(var z=0; z<size; z++)
 		{
 			randomNum = Math.random();
 			if (randomNum >= 0.5)
 				individuals[x][y][z] = 1;
 			else
 				individuals[x][y][z] = 0;
 		}
 	}
}

console.log("Generación: " + generation);

for (x in individuals) // They are ALIVE!!
{
	chromosome[x] = individuals[x][0].concat(individuals[x][1]).join("");

	// 1.3 Decodificación de variables y evaluación en f(x,y)

	var genX = (individuals[x][0].join(""));
	var genY = (individuals[x][1].join(""));

	xi = xl + ( parseInt(genX, 2) * ( (xu - xl) / ( Math.pow(2,xSize) - 1 ) ) );
	yi = yl + ( parseInt(genY, 2) * ( (yu - yl) / ( Math.pow(2,ySize) - 1 ) ) );
	individualsFitness[x] = mathematicalFunction(xi,yi);

	// 1.4 Calcular la aptitud de la generación

	generalFitness += individualsFitness[x];
}

console.log("Aptitud de la población: "+generalFitness);

for (x in individualsFitness) //Calcular la aptitud relativa de cada individuo
{
	relativeFitness[x] = individualsFitness[x] / generalFitness;

	console.log("Individuo "+ (parseInt(x)+1) + ": " + chromosome[x] + "\n Decimal Total: " + parseInt(chromosome[x], 2) + "\n Decimal X: " + parseInt(individuals[x][0].join(""), 2) + "\n Decimal Y: " + parseInt(individuals[x][1].join(""), 2) + "\n Aptitud: " + individualsFitness[x].toFixed(4) + "\n Aptitud relativa: " + relativeFitness[x].toFixed(4));
}

/* 1.5 Primer ciclo de Evolución (Primera Generación)
Se seleccionan los individuos que puede que se cruzen */

selectedOnes = selection(individuals, relativeFitness)

console.log("Cromosomas que pasaron la selección:");
for (x in selectedOnes)
{
	console.log(selectedOnes[x][0].concat(selectedOnes[x][1]).join(""));
}

// 1.6 Cruza
chosenOnes = crossover(selectedOnes,PC);

// 1.7 Mutación
heirs = mutation(chosenOnes,PM);

console.log("------------------Nueva Población--------------------");

for (x in heirs)
{
	console.log("Individuo "+ (parseInt(x)+1) +": "+heirs[x].join(""));
}