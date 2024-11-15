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
    "En un pequeño pueblo, todas las noches a medianoche, un tren viejo pasa por la estación sin pasajeros ni tripulación. Una noche, un adolescente curioso se sube al tren y se encuentra transportado a un mundo fantasmal donde el tiempo se detiene. Debe encontrar una manera de regresar antes de que el reloj marque la medianoche de nuevo, o quedará atrapado para siempre.",
    "Un científico desarrolla un suero que otorga la juventud eterna, pero con una condición: cada vez que se usa, alguien cercano al usuario envejece rápidamente. Dividido entre su deseo de inmortalidad y el amor por su familia, enfrenta una elección desgarradora. Al final, destruye el suero, dándose cuenta de que la verdadera inmortalidad reside en los recuerdos y el legado.",
    "Una mujer compra un espejo antiguo en un mercado de pulgas, solo para descubrir que muestra reflejos de eventos de su pasado. A medida que se adentra más, desentierra secretos que su familia había intentado ocultar. El espejo revela la verdad, pero también le advierte que algunas cosas es mejor dejarlas en el pasado.",
    "Un grupo de exploradores se topa con una cueva antigua con pinturas que parecen cobrar vida bajo la luz de la luna. Mientras acampan dentro, se dan cuenta de que las pinturas no son solo arte, sino una puerta a otra dimensión. Para escapar, deben resolver el enigma oculto dentro de las pinturas antes de convertirse ellos mismos en parte de la obra.",
    "Un anciano recibe una carta de su yo más joven, escrita hace 50 años y prediciendo la fecha y hora exacta de su muerte. Con solo un día de vida, decide vivir al máximo, haciendo todas las cosas que nunca se atrevió a hacer. Pero a medida que se acerca la hora final, se da cuenta de que la carta era un regalo, no una maldición, ayudándole a vivir plenamente el tiempo que le quedaba.",
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