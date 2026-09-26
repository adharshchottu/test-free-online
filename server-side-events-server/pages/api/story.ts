import { NextRequest } from 'next/server'
import cors from '../../lib/cors'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  const stories = [
    "In a small town, every midnight, an old train passes through the station with no passengers and no crew. One night, a curious teenager sneaks onto the train and finds himself transported to a ghostly world where time stands still. He must find a way back before the clock strikes midnight again, or he'll be trapped forever.",
    "A scientist develops a serum that grants eternal youth, but with a catch—each time it's used, someone close to the user ages rapidly. Torn between his desire for immortality and the love for his family, he faces a heartbreaking choice. In the end, he destroys the serum, realizing that true immortality lies in memories and legacy.",
    "A woman buys an antique mirror at a flea market, only to discover that it shows reflections of events from her past. As she delves deeper, she uncovers long-buried secrets that her family had tried to hide. The mirror reveals the truth, but it also warns her that some things are better left in the past.",
    "A group of explorers stumbles upon an ancient cave with paintings that seem to come to life under moonlight. As they camp inside, they realize the paintings are not just art—they are a gateway to another dimension. To escape, they must solve the riddle hidden within the paintings before they become part of the artwork themselves.",
    "An old man receives a letter from his younger self, written 50 years ago and predicting the exact date and time of his death. With only a day left, he decides to live life to the fullest, doing all the things he never dared to before. But as the final hour approaches, he realizes the letter was a gift, not a curse, helping him to truly live in the time he had left.",
    "A lighthouse keeper on a remote island lights his lamp every night, though no ship has passed in decades. One stormy evening, a signal flashes back from the dark sea, spelling out his grandfather's name. He rows out to meet it and finds a ship that vanished a hundred years ago, its crew still waiting for the light that would bring them home.",
    "A librarian discovers a dusty book whose final page rewrites itself every morning, describing what will happen in town the next day. At first she uses it to prevent small accidents and lost pets. Then one morning the page describes her closing the book forever, and she must decide whether the future is something to read or something to write.",
    "A young girl realizes she can hear plants whispering, and the oldest tree in the city tells her it is dying. Nobody believes her, so she spends the summer knocking on doors and planting seedlings with anyone who will listen. By autumn the old tree is gone, but a hundred young trees have learned its songs.",
    "A clockmaker builds a clock that runs backward, and with every tick something lost returns to its owner: a ring, a letter, a forgotten melody. The whole village lines up at his shop. But when the clock begins returning things people had lost on purpose, he learns that not everything missing is waiting to be found.",
    "An astronaut on a solo mission to Mars starts receiving radio messages in her own voice, dated three days in the future. The messages warn her of failures before they happen, and each warning saves her life. On the last day of the journey, she understands that she must record the messages herself and send them back in time.",
    "A street musician plays his violin on the same corner every day, and whenever he plays, it rains only on that street. Shop owners complain until a drought dries up every farm around the city. Soon the farmers are carrying him from field to field, and for the first time in years people are glad to see the rain.",
    "En un pequeño pueblo, todas las noches a medianoche, un tren viejo pasa por la estación sin pasajeros ni tripulación. Una noche, un adolescente curioso se sube al tren y se encuentra transportado a un mundo fantasmal donde el tiempo se detiene. Debe encontrar una manera de regresar antes de que el reloj marque la medianoche de nuevo, o quedará atrapado para siempre.",
    "Un científico desarrolla un suero que otorga la juventud eterna, pero con una condición: cada vez que se usa, alguien cercano al usuario envejece rápidamente. Dividido entre su deseo de inmortalidad y el amor por su familia, enfrenta una elección desgarradora. Al final, destruye el suero, dándose cuenta de que la verdadera inmortalidad reside en los recuerdos y el legado.",
    "Una mujer compra un espejo antiguo en un mercado de pulgas, solo para descubrir que muestra reflejos de eventos de su pasado. A medida que se adentra más, desentierra secretos que su familia había intentado ocultar. El espejo revela la verdad, pero también le advierte que algunas cosas es mejor dejarlas en el pasado.",
    "Un grupo de exploradores se topa con una cueva antigua con pinturas que parecen cobrar vida bajo la luz de la luna. Mientras acampan dentro, se dan cuenta de que las pinturas no son solo arte, sino una puerta a otra dimensión. Para escapar, deben resolver el enigma oculto dentro de las pinturas antes de convertirse ellos mismos en parte de la obra.",
    "Un anciano recibe una carta de su yo más joven, escrita hace 50 años y prediciendo la fecha y hora exacta de su muerte. Con solo un día de vida, decide vivir al máximo, haciendo todas las cosas que nunca se atrevió a hacer. Pero a medida que se acerca la hora final, se da cuenta de que la carta era un regalo, no una maldición, ayudándole a vivir plenamente el tiempo que le quedaba.",
    "Un farero en una isla remota enciende su lámpara cada noche, aunque ningún barco ha pasado en décadas. Una tarde de tormenta, una señal responde desde el mar oscuro, deletreando el nombre de su abuelo. Rema hacia ella y encuentra un barco que desapareció hace cien años, con su tripulación todavía esperando la luz que los llevaría a casa.",
    "Una bibliotecaria descubre un libro polvoriento cuya última página se reescribe cada mañana, describiendo lo que ocurrirá en el pueblo al día siguiente. Al principio lo usa para evitar pequeños accidentes y mascotas perdidas. Pero una mañana la página la describe cerrando el libro para siempre, y debe decidir si el futuro es algo para leer o algo para escribir.",
    "Una niña descubre que puede oír susurrar a las plantas, y el árbol más viejo de la ciudad le dice que se está muriendo. Nadie le cree, así que pasa el verano tocando puertas y plantando árboles jóvenes con quien quiera escucharla. Para el otoño el viejo árbol ya no está, pero cien árboles jóvenes han aprendido sus canciones.",
    "Un relojero construye un reloj que funciona al revés, y con cada tictac algo perdido regresa a su dueño: un anillo, una carta, una melodía olvidada. Todo el pueblo hace fila en su taller. Pero cuando el reloj empieza a devolver cosas que la gente había perdido a propósito, aprende que no todo lo que falta está esperando ser encontrado.",
    "Una astronauta en una misión en solitario a Marte empieza a recibir mensajes de radio con su propia voz, fechados tres días en el futuro. Los mensajes le advierten de fallos antes de que ocurran, y cada advertencia le salva la vida. El último día del viaje, comprende que ella misma debe grabar los mensajes y enviarlos al pasado.",
    "Un músico callejero toca su violín en la misma esquina todos los días, y cada vez que toca, llueve solo en esa calle. Los comerciantes se quejan hasta que una sequía seca todas las granjas alrededor de la ciudad. Pronto los granjeros lo llevan de campo en campo, y por primera vez en años la gente se alegra de ver la lluvia.",
  ];
  const randomStory = stories[Math.floor(Math.random() * stories.length)];


  const words = randomStory.split(' ');

  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        const data = `data: ${word}\n\n`;
        controller.enqueue(encoder.encode(data));
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      // Send the end event
      const endEvent = `event: end\ndata: Stream ended\n\n`;
      controller.enqueue(encoder.encode(endEvent));
      controller.close();
    },
  });

  return cors(
    req,
    new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  );
}

const encoder = new TextEncoder();