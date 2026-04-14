export const QUIZ_QUESTIONS = [
  {
    id: 'skin_type',
    questionSr: 'Kako bi opisao/la svoju kožu?',
    questionEn: "What's your skin type?",
    subtitleSr: 'Izaberi ono što ti najviše odgovara',
    subtitleEn: 'Choose what best describes you',
    options: [
      {
        value: 'dry',
        labelSr: 'Suva i zategnuta',
        labelEn: 'Dry and tight',
        descSr: 'Osećam zatezanje posle umivanja',
        descEn: 'I feel tightness after washing'
      },
      {
        value: 'oily',
        labelSr: 'Masna i sjajna',
        labelEn: 'Oily and shiny',
        descSr: 'Koža se masni tokom dana',
        descEn: 'Skin gets oily during the day'
      },
      {
        value: 'combination',
        labelSr: 'Kombinovana',
        labelEn: 'Combination',
        descSr: 'T-zona masna, ostalo normalno ili suvo',
        descEn: 'Oily T-zone, rest normal or dry'
      },
      {
        value: 'sensitive',
        labelSr: 'Osetljiva i reaktivna',
        labelEn: 'Sensitive and reactive',
        descSr: 'Lako se crveni ili reaguje na proizvode',
        descEn: 'Easily gets red or reacts to products'
      }
    ]
  },
  {
    id: 'primary_concern',
    questionSr: 'Šta te trenutno najviše muči?',
    questionEn: "What's your main skin concern?",
    subtitleSr: 'Izaberi jedan primarni problem',
    subtitleEn: 'Choose your primary concern',
    options: [
      {
        value: 'dryness',
        labelSr: 'Dehidracija i suvoća',
        labelEn: 'Dehydration and dryness',
        descSr: 'Koža mi je suva, ljušti se ili puca',
        descEn: 'Skin is dry, flaking or cracking'
      },
      {
        value: 'aging',
        labelSr: 'Bore i starenje',
        labelEn: 'Wrinkles and aging',
        descSr: 'Sitne linije, bore ili umoran izgled',
        descEn: 'Fine lines, wrinkles or tired look'
      },
      {
        value: 'eczema',
        labelSr: 'Ekcem, osip ili svrab',
        labelEn: 'Eczema, rash or itching',
        descSr: 'Upala, crvenilo, svrab ili dermatitis',
        descEn: 'Inflammation, redness, itching or dermatitis'
      },
      {
        value: 'spots',
        labelSr: 'Fleke i neravnomeran ten',
        labelEn: 'Spots and uneven skin tone',
        descSr: 'Tamne fleke, tragovi od akni ili sunca',
        descEn: 'Dark spots, acne marks or sun damage'
      }
    ]
  },
  {
    id: 'body_concern',
    questionSr: 'Imaš li problem i sa kožom tela?',
    questionEn: 'Do you have body skin concerns too?',
    subtitleSr: 'Pored lica, da li te nešto muči i na telu?',
    subtitleEn: 'Besides your face, any body concerns?',
    options: [
      {
        value: 'none',
        labelSr: 'Ne, samo lice',
        labelEn: 'No, just my face',
        descSr: 'Fokusiram se samo na negu lica',
        descEn: 'I focus only on facial care'
      },
      {
        value: 'dry_body',
        labelSr: 'Suva ili gruba koža tela',
        labelEn: 'Dry or rough body skin',
        descSr: 'Koža se ljušti ili je gruba na dodir',
        descEn: 'Skin flakes or feels rough to touch'
      },
      {
        value: 'stretch_marks',
        labelSr: 'Strije ili celulitis',
        labelEn: 'Stretch marks or cellulite',
        descSr: 'Strije od rasta, trudnoće ili promene kilaže',
        descEn: 'From growth, pregnancy or weight changes'
      },
      {
        value: 'hands',
        labelSr: 'Suve ili ispucale ruke',
        labelEn: 'Dry or cracked hands',
        descSr: 'Ruke su suve, pucaju ili se hrapave',
        descEn: 'Hands are dry, cracked or rough'
      }
    ]
  },
  {
    id: 'routine_experience',
    questionSr: 'Kakva ti je trenutna rutina?',
    questionEn: "What's your current skincare routine?",
    subtitleSr: 'Iskreno — koliko se trenutno baviš negom?',
    subtitleEn: 'Honestly — how much do you currently do?',
    options: [
      {
        value: 'none',
        labelSr: 'Nemam nikakvu rutinu',
        labelEn: "I don't have a routine",
        descSr: 'Tek počinjem ili ne koristim ništa redovno',
        descEn: "Just starting or don't use anything regularly"
      },
      {
        value: 'basic',
        labelSr: 'Samo se umivam',
        labelEn: 'Just cleanse',
        descSr: 'Koristim sapun ili umivalicu, ništa više',
        descEn: 'I use soap or cleanser, nothing more'
      },
      {
        value: 'medium',
        labelSr: 'Umivanje i krema',
        labelEn: 'Cleanse and moisturize',
        descSr: 'Imam basic rutinu ali bih je poboljšao/la',
        descEn: 'Have a basic routine but want to improve it'
      },
      {
        value: 'full',
        labelSr: 'Imam kompletnu rutinu',
        labelEn: 'I have a full routine',
        descSr: 'Redovno koristim više proizvoda jutro i veče',
        descEn: 'I regularly use multiple products AM and PM'
      }
    ]
  },
  {
    id: 'sun_exposure',
    questionSr: 'Koliko si izložen/a suncu?',
    questionEn: 'How much sun exposure do you get?',
    subtitleSr: 'Ovo nam pomaže da preporučimo zaštitu',
    subtitleEn: 'This helps us recommend protection',
    options: [
      {
        value: 'low',
        labelSr: 'Uglavnom sam u zatvorenom',
        labelEn: 'Mostly indoors',
        descSr: 'Kancelarija, kuća — malo vremena napolju',
        descEn: 'Office, home — little time outside'
      },
      {
        value: 'medium',
        labelSr: 'Povremeno napolju',
        labelEn: 'Occasionally outside',
        descSr: 'Šetnje, errands, vikend aktivnosti',
        descEn: 'Walks, errands, weekend activities'
      },
      {
        value: 'high',
        labelSr: 'Dosta vremena napolju',
        labelEn: 'A lot of time outside',
        descSr: 'Aktivan/na, sport, priroda, plaža',
        descEn: 'Active lifestyle, sports, nature, beach'
      },
      {
        value: 'seeking_spf',
        labelSr: 'Tražim prirodni SPF',
        labelEn: 'Looking for natural SPF',
        descSr: 'Koristim hemijski SPF, hoću prirodnu opciju',
        descEn: 'Using chemical SPF, want natural alternative'
      }
    ]
  },
  {
    id: 'priority',
    questionSr: 'Šta ti je najvažnije u kozmetici?',
    questionEn: 'What matters most to you in skincare?',
    subtitleSr: 'Tvoje vrednosti pomažu da personalizujemo preporuku',
    subtitleEn: 'Your values help us personalize the recommendation',
    options: [
      {
        value: 'natural',
        labelSr: '100% prirodni sastojci',
        labelEn: '100% natural ingredients',
        descSr: 'Bez hemikalija, samo iz prirode',
        descEn: 'No chemicals, only from nature'
      },
      {
        value: 'effective',
        labelSr: 'Brzi i vidljivi rezultati',
        labelEn: 'Fast and visible results',
        descSr: 'Hoću da vidim razliku što pre',
        descEn: 'I want to see a difference quickly'
      },
      {
        value: 'gentle',
        labelSr: 'Blag na osetljivu kožu',
        labelEn: 'Gentle on sensitive skin',
        descSr: 'Koža mi reaguje na jake proizvode',
        descEn: 'My skin reacts to strong products'
      },
      {
        value: 'complete',
        labelSr: 'Kompletna dnevna rutina',
        labelEn: 'Complete daily routine',
        descSr: 'Hoću sistem koji pokrije sve',
        descEn: 'I want a system that covers everything'
      }
    ]
  }
]

export type QuizQuestion = typeof QUIZ_QUESTIONS[0]
export type QuizAnswers = Record<string, string>
