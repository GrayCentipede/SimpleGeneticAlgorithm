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

// ------------------------------

function generateCET(type, mathFunction)
{	
	var generation = 0, bestFitness = 0, generalFitness = 0;

	var individuals = [], relativeFitness = [], selectedOnes = [], bestIndividual = [];

	document.getElementById("GraphicClassicEliteTournament").setAttribute("points", "");

	//1.2 Generar a la población inicial

	for (var x=0; x<populSize; x++) // They're ALIVE!!!
	{
		individuals[x] = [];
		for(y=0; y<chromosomeSize; y++)
		{
	 		randomNum = Math.random();
	 		if (randomNum >= 0.5)
	 			individuals[x][y] = 1;
	 		else
	 			individuals[x][y] = 0;
	 	}
	}

	do
	{
		console.log("------------------Generación " + generation+"-----------------");

		console.log("------------------ Población --------------------");

		for (x in individuals)
			console.log("Individuo "+ (parseInt(x)+1) +": "+individuals[x].join(""));

		individualsFitness = fitness(individuals, type, mathFunction);

		generalFitness = populationFitness(individualsFitness);

		bestFitnessZ = bFitness(bestIndividual, type, mathFunction);

		console.log("Aptitud que pasó: "+bestFitnessZ);

		console.log("Aptitud de la Generación: "+generalFitness);

		worstFitness = Math.min.apply(Math, individualsFitness);
		for (x in individualsFitness)
		{
			if (worstFitness == individualsFitness[x])
				wfLoc = x;
		}

		if (Math.abs(bestFitnessZ) > Math.abs(worstFitness))
		{
			individuals[wfLoc] = bestIndividual;
			individualsFitness[wfLoc] = bestFitnessZ;
		}

		bestFitness = Math.max.apply(Math, individualsFitness);
		for (x in individualsFitness)
		{
			if (bestFitness == individualsFitness[x])
				bfLoc = x;
		}

		bestIndividual = individuals[bfLoc];

		console.log("Aptitud de la Generación: "+generalFitness);

		for (x in individualsFitness)
			console.log("Individuo "+ (parseInt(x)+1) +": \n"+individuals[x].join("")+"\n Aptitud del individuo: "+ individualsFitness[x].toFixed(4) );

		if (type == 0)
			bestFitness = 1/bestFitness;

		if (generation%10 == 0)
		{
			var graphPoints = document.getElementById("GraphicClassicEliteTournament").getAttribute("points");
			graphPoints += ""+ (5*(generation/10)+100) +" "+ (500 - (Math.abs(parseFloat(bestFitness)*10))) +", ";
			document.getElementById("GraphicClassicEliteTournament").setAttribute("points", graphPoints);
		}

		selectedOnes = selectionClassicTournament(individuals, individualsFitness);

		/*console.log("Cromosomas que pasaron la selección:");
		for (x in selectedOnes)
		{
			console.log(selectedOnes[x].join(""));
		} */
		//chosenOnes = crossover(selectedOnes,PC);
		chosenOnes = crossoverUni(selectedOnes,PC);

		/* for (x in chosenOnes)
			console.log("Supervivientes "+ (parseInt(x)+1) +": "+chosenOnes[x].join("")); */

		individuals = mutation(chosenOnes,PM);

		generation++;
	} while (generation <= maxGenerations);
	document.getElementById("valueCET").textContent= "f(x,y) = "+bestFitness.toFixed(4);
}