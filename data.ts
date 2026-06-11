import { DialogueData, QuizQuestion } from './types';

export const dialogues: DialogueData[] = [
  {
    id: 'gor_weekend',
    title: 'Դիալոգ 1 — Planes para el fin de semana',
    titleArm: 'Շաբաթավերջի ծրագրեր',
    ownerName: 'Գոռ',
    targetWords: [
      'viajaré',
      'iremos',
      'visitarás',
      'compraré',
      'comeremos',
      'saldremos',
      'llevará',
      'hará',
      'harás',
      'veremos',
      'volveremos'
    ],
    lines: [
      {
        id: 'g1_1',
        speaker: 'Lucía',
        textTemplate: 'Carlos, ¿qué __________ este fin de semana?',
        missingWords: ['harás'],
        fullText: 'Carlos, ¿qué harás este fin de semana?',
        translationArm: 'Կառլոս, ի՞նչ կանես այս շաբաթավերջին։'
      },
      {
        id: 'g1_2',
        speaker: 'Carlos',
        textTemplate: 'Este fin de semana __________ a Valencia con mi familia.',
        missingWords: ['viajaré'],
        fullText: 'Este fin de semana viajaré a Valencia con mi familia.',
        translationArm: 'Այս շաբաթավերջին ես ընտանիքիս հետ կճանապարհորդեմ Վալենսիա։'
      },
      {
        id: 'g1_3',
        speaker: 'Lucía',
        textTemplate: '¡Qué bien! ¿Y qué __________ allí?',
        missingWords: ['visitarás'],
        fullText: '¡Qué bien! ¿Y qué visitarás allí?',
        translationArm: 'Շատ լավ։ Իսկ այնտեղ ի՞նչ կայցելես։'
      },
      {
        id: 'g1_4',
        speaker: 'Carlos',
        textTemplate: 'Primero __________ al centro de la ciudad y después __________ paella en un restaurante.',
        missingWords: ['iremos', 'comeremos'],
        fullText: 'Primero iremos al centro de la ciudad y después comeremos paella en un restaurante.',
        translationArm: 'Սկզբում կգնանք քաղաքի կենտրոն, հետո ռեստորանում պաեյա կուտենք։'
      },
      {
        id: 'g1_5',
        speaker: 'Lucía',
        textTemplate: '¿A qué hora __________ de casa?',
        missingWords: ['saldremos'],
        fullText: '¿A qué hora saldremos de casa?',
        translationArm: 'Ժամը քանիսի՞ն դուրս կգանք տնից։'
      },
      {
        id: 'g1_6',
        speaker: 'Carlos',
        textTemplate: 'Saldremos a las ocho de la mañana. Mi padre __________ las maletas al coche.',
        missingWords: ['llevará'],
        fullText: 'Saldremos a las ocho de la mañana. Mi padre llevará las maletas al coche.',
        translationArm: 'Դուրս կգանք առավոտյան ժամը ութին։ Հայրս ճամպրուկները կտանի մեքենայի մոտ։'
      },
      {
        id: 'g1_7',
        speaker: 'Lucía',
        textTemplate: '¿Y tu hermana qué __________?',
        missingWords: ['hará'],
        fullText: '¿Y tu hermana qué hará?',
        translationArm: 'Իսկ քույրդ ի՞նչ կանի։'
      },
      {
        id: 'g1_8',
        speaker: 'Carlos',
        textTemplate: 'Ella sacará fotos and nosotros __________ la playa por la tarde.',
        missingWords: ['veremos'],
        fullText: 'Ella sacará fotos y nosotros veremos la playa por la tarde.',
        translationArm: 'Նա նկարներ կանի, իսկ մենք կեսօրից հետո կտեսնենք լողափը։'
      },
      {
        id: 'g1_9',
        speaker: 'Lucía',
        textTemplate: 'Muy bien. Yo también __________ algunos recuerdos para mi familia.',
        missingWords: ['compraré'],
        fullText: 'Muy bien. Yo también compraré algunos recuerdos para mi familia.',
        translationArm: 'Շատ լավ։ Ես էլ իմ ընտանիքի համար մի քանի հուշանվեր կգնեմ։'
      },
      {
        id: 'g1_10',
        speaker: 'Carlos',
        textTemplate: 'Perfecto. ¿Cuándo __________ a casa?',
        missingWords: ['volveremos'],
        fullText: 'Perfecto. ¿Cuándo volveremos a casa?',
        translationArm: 'Հիանալի է։ Ե՞րբ կվերադառնանք տուն։'
      },
      {
        id: 'g1_11',
        speaker: 'Lucía',
        textTemplate: 'Creo que volveremos el domingo por la noche.',
        missingWords: [],
        fullText: 'Creo que volveremos el domingo por la noche.',
        translationArm: 'Կարծում եմ՝ կիրակի երեկոյան կվերադառնանք։'
      }
    ]
  },
  {
    id: 'gayane_airport',
    title: 'Դիալոգ 2 — En el aeropuerto',
    titleArm: 'Օդանավակայանում',
    ownerName: 'Գայանե',
    targetWords: [
      'saldrá',
      'llegaremos',
      'facturaremos',
      'mostrará',
      'esperaremos',
      'subiremos',
      'tendrá',
      'comprarán',
      'llamarán',
      'volaremos'
    ],
    lines: [
      {
        id: 'g2_1',
        speaker: 'Carlos',
        textTemplate: 'Lucía, mañana __________ a España. ¿Estás preparada?',
        missingWords: ['volaremos'],
        fullText: 'Lucía, mañana volaremos a España. ¿Estás preparada?',
        translationArm: 'Լուսիա, վաղը մենք կթռչենք Իսպանիա։ Պատրա՞ստ ես։'
      },
      {
        id: 'g2_2',
        speaker: 'Lucía',
        textTemplate: 'Sí, ya tengo mi pasaporte. ¿A qué hora __________ al aeropuerto?',
        missingWords: ['llegaremos'],
        fullText: 'Sí, ya tengo mi pasaporte. ¿A qué hora llegaremos al aeropuerto?',
        translationArm: 'Այո, ես արդեն ունեմ իմ անձնագիրը։ Ժամը քանիսի՞ն կհասնենք օդանավակայան։'
      },
      {
        id: 'g2_3',
        speaker: 'Carlos',
        textTemplate: 'Llegaremos a las nueve. Primero __________ las maletas.',
        missingWords: ['facturaremos'],
        fullText: 'Llegaremos a las nueve. Primero facturaremos las maletas.',
        translationArm: 'Կհասնենք ժամը իննին։ Սկզբում կձևակերպենք ճամպրուկները։'
      },
      {
        id: 'g2_4',
        speaker: 'Lucía',
        textTemplate: '¿Y después qué haremos?',
        missingWords: [],
        fullText: '¿Y después qué haremos?',
        translationArm: 'Իսկ հետո ի՞նչ կանենք։'
      },
      {
        id: 'g2_5',
        speaker: 'Carlos',
        textTemplate: 'Después el empleado nos __________ la puerta de embarque.',
        missingWords: ['mostrará'],
        fullText: 'Después el empleado nos mostrará la puerta de embarque.',
        translationArm: 'Հետո աշխատակիցը մեզ ցույց կտա նստեցման դարպասը։'
      },
      {
        id: 'g2_6',
        speaker: 'Lucía',
        textTemplate: 'Perfecto. ¿El avión __________ a las once?',
        missingWords: ['saldrá'],
        fullText: 'Perfecto. ¿El avión saldrá a las once?',
        translationArm: 'Հիանալի է։ Ինքնաթիռը ժամը տասնմեկի՞ն կմեկնի։'
      },
      {
        id: 'g2_7',
        speaker: 'Carlos',
        textTemplate: 'Sí, saldrá a las once y media. Nosotros __________ en la sala de espera.',
        missingWords: ['esperaremos'],
        fullText: 'Sí, saldrá a las once y media. Nosotros esperaremos en la sala de espera.',
        translationArm: 'Այո, կմեկնի տասնմեկ անց կես։ Մենք կսպասենք սպասասրահում։'
      },
      {
        id: 'g2_8',
        speaker: 'Lucía',
        textTemplate: '¿Crees que Carlos y Ana también __________ algo en el aeropuerto?',
        missingWords: ['comprarán'],
        fullText: '¿Crees que Carlos y Ana también comprarán algo en el aeropuerto?',
        translationArm: 'Կարծո՞ւմ ես՝ Կառլոսն ու Անան նույնպես օդանավակայանում ինչ-որ բան կգնեն։'
      },
      {
        id: 'g2_9',
        speaker: 'Carlos',
        textTemplate: 'Sí, probablemente __________ agua y bocadillos.',
        missingWords: ['comprarán'],
        fullText: 'Sí, probablemente comprarán agua y bocadillos.',
        translationArm: 'Այո, հավանաբար ջուր և սենդվիչներ կգնեն։'
      },
      {
        id: 'g2_10',
        speaker: 'Lucía',
        textTemplate: '¿Y cuándo __________ al avión?',
        missingWords: ['subiremos'],
        fullText: '¿Y cuándo subiremos al avión?',
        translationArm: 'Իսկ ե՞րբ կնստենք ինքնաթիռ։'
      },
      {
        id: 'g2_11',
        speaker: 'Carlos',
        textTemplate: 'Subiremos cuando __________ a los pasajeros.',
        missingWords: ['llamarán'],
        fullText: 'Subiremos cuando llamarán a los pasajeros.',
        translationArm: 'Կնստենք, երբ ուղևորներին կանչեն։'
      },
      {
        id: 'g2_12',
        speaker: 'Lucía',
        textTemplate: 'Entonces todo estará bien. Mañana __________ hacia Madrid.',
        missingWords: ['volaremos'],
        fullText: 'Entonces todo estará bien. Mañana volaremos hacia Madrid.',
        translationArm: 'Ուրեմն ամեն ինչ լավ կլինի։ Վաղը մենք կթռչենք դեպի Մադրիդ։'
      }
    ]
  }
];

export const duelQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    armenianText: 'ի՞նչ կանես այս շաբաթավերջին։',
    correctSpanish: '¿qué harás este fin de semana?',
    options: [
      '¿qué harás este fin de semana?',
      '¿qué comprarás para mi familia?',
      '¿qué saldremos de casa?',
      '¿qué comeremos en el restaurante?'
    ]
  },
  {
    id: 'q2',
    armenianText: 'ես ընտանիքիս հետ կճանապարհորդեմ Վալենսիա։',
    correctSpanish: 'viajaré a Valencia con mi familia.',
    options: [
      'viajaré a Valencia con mi familia.',
      'volveremos a casa el domingo.',
      'iremos al centro de la ciudad.',
      'veremos la playa por la tarde.'
    ]
  },
  {
    id: 'q3',
    armenianText: 'Իսկ այնտեղ ի՞նչ կայցելես։',
    correctSpanish: '¿Y qué visitarás allí?',
    options: [
      '¿Y qué visitarás allí?',
      '¿Y qué harás este fin de semana?',
      '¿A qué hora saldremos?',
      '¿Y tu hermana qué hará?'
    ]
  },
  {
    id: 'q4',
    armenianText: 'Սկզբում կգնանք քաղաքի կենտրոն',
    correctSpanish: 'Primero iremos al centro de la ciudad',
    options: [
      'Primero iremos al centro de la ciudad',
      'Primero facturaremos las maletas',
      'Primero comeremos paella',
      'Volveremos el domingo por la noche'
    ]
  },
  {
    id: 'q5',
    armenianText: 'հետո ռեստորանում պաեյա կուտենք։',
    correctSpanish: 'después comeremos paella en un restaurante.',
    options: [
      'después comeremos paella en un restaurante.',
      'después el empleado nos mostrará la puerta.',
      'después compraremos recuerdos para mi familia.',
      'iremos a la playa por la tarde.'
    ]
  },
  {
    id: 'q6',
    armenianText: 'Ժամը քանիսի՞ն դուրս կգանք տնից։',
    correctSpanish: '¿A qué hora saldremos de casa?',
    options: [
      '¿A qué hora saldremos de casa?',
      '¿A qué hora llegaremos al aeropuerto?',
      '¿Cuándo volveremos a casa?',
      '¿A qué hora saldrá el avión?'
    ]
  },
  {
    id: 'q7',
    armenianText: 'Հայրս ճամպրուկները կտանի մեքենայի մոտ։',
    correctSpanish: 'Mi padre llevará las maletas al coche.',
    options: [
      'Mi padre llevará las maletas al coche.',
      'Primero facturaremos las maletas.',
      'El empleado llevará las maletas al avión.',
      'Mi hermana llevará fotos en su mochila.'
    ]
  },
  {
    id: 'q8',
    armenianText: 'Իսկ քույրդ ի՞նչ կանի։',
    correctSpanish: '¿Y tu hermana qué hará?',
    options: [
      '¿Y tu hermana qué hará?',
      '¿Y tú qué harás?',
      '¿Y cuándo subiremos al avión?',
      '¿Y tu madre qué comprará?'
    ]
  },
  {
    id: 'q9',
    armenianText: 'մենք կեսօրից հետո կտեսնենք լողափը։',
    correctSpanish: 'nosotros veremos la playa por la tarde.',
    options: [
      'nosotros veremos la playa por la tarde.',
      'nosotros volveremos el domingo por la noche.',
      'nosotros comeremos paella en un restaurante.',
      'nosotros viajaremos a España mañana.'
    ]
  },
  {
    id: 'q10',
    armenianText: 'Ես էլ իմ ընտանիքի համար մի քանի հուշանվեր կգնեմ։',
    correctSpanish: 'Yo también compraré algunos recuerdos para mi familia.',
    options: [
      'Yo también compraré algunos recuerdos para mi familia.',
      'Yo también llevaré las maletas al coche.',
      'Yo también viajaré a Valencia con mi familia.',
      'Carlos y Ana comprarán recuerdos en el aeropuerto.'
    ]
  },
  {
    id: 'q11',
    armenianText: 'Ե՞րբ կվերադառնանք տուն։',
    correctSpanish: '¿Cuándo volveremos a casa?',
    options: [
      '¿Cuándo volveremos a casa?',
      '¿A qué hora llegaremos al aeropuerto?',
      '¿Cuándo volverán tus padres?',
      '¿Cuándo saldremos de la ciudad?'
    ]
  },
  {
    id: 'q12',
    armenianText: 'Կարծում եմ՝ կիրակի երեկոյան կվերադառնանք։',
    correctSpanish: 'Creo que volveremos el domingo por la noche.',
    options: [
      'Creo que volveremos el domingo por la noche.',
      'Creo que el avión saldrá a las once.',
      'Creo que mañana volaremos hacia Madrid.',
      'Creo que nos esperaremos en la playa.'
    ]
  },
  {
    id: 'q13',
    armenianText: 'վաղը մենք կթռչենք Իսպանիա։',
    correctSpanish: 'mañana volaremos a España.',
    options: [
      'mañana volaremos a España.',
      'mañana viajaré a Valencia.',
      'mañana saldremos de casa.',
      'mañana llegaremos al aeropuerto.'
    ]
  },
  {
    id: 'q14',
    armenianText: 'Պատրա՞ստ ես։',
    correctSpanish: '¿Estás preparada?',
    options: [
      '¿Estás preparada?',
      '¿Qué harás allí?',
      '¿Cuándo volveremos?',
      '¿Dónde están las maletas?'
    ]
  },
  {
    id: 'q15',
    armenianText: 'Այո, ես արդեն ունեմ իմ անձնագիրը։',
    correctSpanish: 'Sí, ya tengo mi pasaporte.',
    options: [
      'Sí, ya tengo mi pasaporte.',
      'Sí, ya compré los recuerdos.',
      'Sí, ya tengo mis maletas.',
      'Sí, ya facturé mi coche.'
    ]
  },
  {
    id: 'q16',
    armenianText: 'Ժամը քանիսի՞ն կհասնենք օդանավակայան։',
    correctSpanish: '¿A qué hora llegaremos al aeropuerto?',
    options: [
      '¿A qué hora llegaremos al aeropuerto?',
      '¿A qué hora saldremos de casa?',
      '¿A qué hora saldrá el avión?',
      '¿Cuándo volveremos a casa?'
    ]
  },
  {
    id: 'q17',
    armenianText: 'Կհասնենք ժամը իննին։',
    correctSpanish: 'Llegaremos a las nueve.',
    options: [
      'Llegaremos a las nueve.',
      'Saldremos a las ocho de la mañana.',
      'Volveremos el domingo por la noche.',
      'El avión saldrá a las once.'
    ]
  },
  {
    id: 'q18',
    armenianText: 'Սկզբում կձևակերպենք ճամպրուկները։',
    correctSpanish: 'Primero facturaremos las maletas.',
    options: [
      'Primero facturaremos las maletas.',
      'Primero iremos al centro de la ciudad.',
      'Primero compraremos agua y bocadillos.',
      'Primero sacaremos fotos en la playa.'
    ]
  },
  {
    id: 'q19',
    armenianText: 'Իսկ հետո ի՞նչ կանենք։',
    correctSpanish: '¿Y después qué haremos?',
    options: [
      '¿Y después qué haremos?',
      '¿Y tu hermana qué hará?',
      '¿Y cuándo subiremos al avión?',
      '¿Y qué visitarás allí?'
    ]
  },
  {
    id: 'q20',
    armenianText: 'Հետո աշխատակիցը մեզ ցույց կտա նստեցման դարպասը։',
    correctSpanish: 'Después el empleado nos mostrará la puerta de embarque.',
    options: [
      'Después el empleado nos mostrará la puerta de embarque.',
      'Después mi padre llevará las maletas al coche.',
      'Después comeremos paella en un restaurante.',
      'Después subiremos al avión cuando llamarán.'
    ]
  },
  {
    id: 'q21',
    armenianText: 'Ինքնաթիռը ժամը տասնմեկի՞ն կմեկնի։',
    correctSpanish: '¿El avión saldrá a las once?',
    options: [
      '¿El avión saldrá a las once?',
      '¿El avión saldrá a las once y media?',
      '¿A qué hora saldremos de casa?',
      '¿A qué hora llegaremos al aeropuerto?'
    ]
  },
  {
    id: 'q22',
    armenianText: 'Մենք կսպասենք սպասասրահում։',
    correctSpanish: 'Nosotros esperaremos en la sala de espera.',
    options: [
      'Nosotros esperaremos en la sala de espera.',
      'Nosotros comeremos paella en un restaurante.',
      'Nosotros volveremos el domingo por la noche.',
      'Nosotros subiremos al avión con mi familia.'
    ]
  },
  {
    id: 'q23',
    armenianText: 'Կարծո՞ւմ ես՝ Կառլոսն ու Անան նույնպես օդանավակայանում ինչ-որ բան կգնեն։',
    correctSpanish: '¿Crees que Carlos y Ana también comprarán algo en el aeropuerto?',
    options: [
      '¿Crees que Carlos y Ana también comprarán algo en el aeropuerto?',
      '¿Crees que tu familia también viajará a Valencia con nosotros?',
      '¿Crees que el avión saldrá a las once de la mañana?',
      '¿Crees que nosotros veremos la playa por la tarde?'
    ]
  },
  {
    id: 'q24',
    armenianText: 'Այո, հավանաբար ջուր և սենդվիչներ կգնեն։',
    correctSpanish: 'Sí, probablemente comprarán agua y bocadillos.',
    options: [
      'Sí, probablemente comprarán agua y bocadillos.',
      'Sí, probablemente viajarán con mi familia.',
      'Sí, probablemente facturaremos las maletas.',
      'Sí, probablemente volveremos el domingo.'
    ]
  },
  {
    id: 'q25',
    armenianText: 'Իսկ ե՞րբ կնստենք ինքնաթիռ։',
    correctSpanish: '¿Y cuándo subiremos al avión?',
    options: [
      '¿Y cuándo subiremos al avión?',
      '¿Y después qué haremos?',
      '¿A qué hora llegaremos al aeropuerto?',
      '¿A qué hora saldrá el avión de la pista?'
    ]
  },
  {
    id: 'q26',
    armenianText: 'Կնստենք, երբ ուղևորներին կանչեն։',
    correctSpanish: 'Subiremos cuando llamarán a los pasajeros.',
    options: [
      'Subiremos cuando llamarán a los pasajeros.',
      'Llegaremos cuando facturaremos las maletas.',
      'Saldremos a las ocho de la mañana.',
      'Volveremos cuando sea el domingo por la noche.'
    ]
  },
  {
    id: 'q27',
    armenianText: 'Վաղը մենք կթռչենք դեպի Մադրիդ։',
    correctSpanish: 'Mañana volaremos hacia Madrid.',
    options: [
      'Mañana volaremos hacia Madrid.',
      'Mañana viajaré a Valencia.',
      'Mañana saldremos a las ocho.',
      'Mañana comeremos paella en España.'
    ]
  }
];
