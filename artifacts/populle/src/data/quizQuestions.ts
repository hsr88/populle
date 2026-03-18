export type QuestionType = 'population' | 'comparison' | 'capital' | 'flag' | 'history';

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export const quizQuestions: QuizQuestion[] = [
  // Population questions (type: 'population')
  { id: 1, type: 'population', question: 'What is the approximate population of India?', options: ['1.0 billion', '1.2 billion', '1.4 billion', '1.6 billion'], correctAnswer: 2, explanation: 'India surpassed China in 2023 with ~1.4 billion people' },
  { id: 2, type: 'population', question: 'What is the population of the United States?', options: ['280 million', '310 million', '335 million', '360 million'], correctAnswer: 2, explanation: 'The US has approximately 335 million people (2024)' },
  { id: 3, type: 'population', question: 'How many people live in Indonesia?', options: ['240 million', '280 million', '320 million', '360 million'], correctAnswer: 1, explanation: 'Indonesia has ~280 million people, 4th largest globally' },
  { id: 4, type: 'population', question: 'What is Brazil\'s population?', options: ['190 million', '215 million', '240 million', '265 million'], correctAnswer: 1, explanation: 'Brazil has ~215 million people' },
  { id: 5, type: 'population', question: 'How many people live in Pakistan?', options: ['200 million', '240 million', '280 million', '320 million'], correctAnswer: 1, explanation: 'Pakistan has ~240 million people and growing rapidly' },
  { id: 6, type: 'population', question: 'What is Nigeria\'s population?', options: ['180 million', '200 million', '223 million', '250 million'], correctAnswer: 2, explanation: 'Nigeria has ~223 million people, largest in Africa' },
  { id: 7, type: 'population', question: 'How many people live in Bangladesh?', options: ['150 million', '173 million', '195 million', '220 million'], correctAnswer: 1, explanation: 'Bangladesh has ~173 million in a small area' },
  { id: 8, type: 'population', question: 'What is Russia\'s population?', options: ['130 million', '143 million', '156 million', '169 million'], correctAnswer: 1, explanation: 'Russia has ~143 million but declining' },
  { id: 9, type: 'population', question: 'How many people live in Mexico?', options: ['100 million', '115 million', '130 million', '145 million'], correctAnswer: 2, explanation: 'Mexico has ~130 million people' },
  { id: 10, type: 'population', question: 'What is Japan\'s population?', options: ['110 million', '125 million', '140 million', '155 million'], correctAnswer: 1, explanation: 'Japan has ~125 million and declining' },
  { id: 11, type: 'population', question: 'How many people live in Ethiopia?', options: ['100 million', '120 million', '140 million', '160 million'], correctAnswer: 1, explanation: 'Ethiopia has ~120 million, 2nd largest in Africa' },
  { id: 12, type: 'population', question: 'What is the Philippines\' population?', options: ['100 million', '115 million', '130 million', '145 million'], correctAnswer: 1, explanation: 'Philippines has ~115 million people' },
  { id: 13, type: 'population', question: 'How many people live in Egypt?', options: ['95 million', '105 million', '115 million', '125 million'], correctAnswer: 1, explanation: 'Egypt has ~105 million people' },
  { id: 14, type: 'population', question: 'What is Vietnam\'s population?', options: ['85 million', '100 million', '115 million', '130 million'], correctAnswer: 1, explanation: 'Vietnam has ~100 million people' },
  { id: 15, type: 'population', question: 'How many people live in Germany?', options: ['78 million', '84 million', '90 million', '96 million'], correctAnswer: 1, explanation: 'Germany has ~84 million people' },
  { id: 16, type: 'population', question: 'What is Turkey\'s population?', options: ['75 million', '85 million', '95 million', '105 million'], correctAnswer: 1, explanation: 'Turkey has ~85 million people' },
  { id: 17, type: 'population', question: 'How many people live in Iran?', options: ['75 million', '87 million', '99 million', '111 million'], correctAnswer: 1, explanation: 'Iran has ~87 million people' },
  { id: 18, type: 'population', question: 'What is Thailand\'s population?', options: ['65 million', '71 million', '77 million', '83 million'], correctAnswer: 1, explanation: 'Thailand has ~71 million people' },
  { id: 19, type: 'population', question: 'How many people live in the United Kingdom?', options: ['60 million', '67 million', '74 million', '81 million'], correctAnswer: 1, explanation: 'UK has ~67 million people' },
  { id: 20, type: 'population', question: 'What is France\'s population?', options: ['60 million', '65 million', '70 million', '75 million'], correctAnswer: 1, explanation: 'France has ~65 million people' },
  { id: 21, type: 'population', question: 'How many people live in South Africa?', options: ['55 million', '60 million', '65 million', '70 million'], correctAnswer: 1, explanation: 'South Africa has ~60 million people' },
  { id: 22, type: 'population', question: 'What is Tanzania\'s population?', options: ['55 million', '63 million', '71 million', '79 million'], correctAnswer: 1, explanation: 'Tanzania has ~63 million people' },
  { id: 23, type: 'population', question: 'How many people live in Italy?', options: ['55 million', '59 million', '63 million', '67 million'], correctAnswer: 1, explanation: 'Italy has ~59 million and declining' },
  { id: 24, type: 'population', question: 'What is Kenya\'s population?', options: ['45 million', '54 million', '63 million', '72 million'], correctAnswer: 1, explanation: 'Kenya has ~54 million people' },
  { id: 25, type: 'population', question: 'How many people live in Myanmar?', options: ['45 million', '54 million', '63 million', '72 million'], correctAnswer: 1, explanation: 'Myanmar has ~54 million people' },
  { id: 26, type: 'population', question: 'What is South Korea\'s population?', options: ['48 million', '51 million', '54 million', '57 million'], correctAnswer: 1, explanation: 'South Korea has ~51 million and declining' },
  { id: 27, type: 'population', question: 'How many people live in Colombia?', options: ['45 million', '52 million', '59 million', '66 million'], correctAnswer: 1, explanation: 'Colombia has ~52 million people' },
  { id: 28, type: 'population', question: 'What is Spain\'s population?', options: ['42 million', '47 million', '52 million', '57 million'], correctAnswer: 1, explanation: 'Spain has ~47 million people' },
  { id: 29, type: 'population', question: 'How many people live in Argentina?', options: ['40 million', '45 million', '50 million', '55 million'], correctAnswer: 1, explanation: 'Argentina has ~45 million people' },
  { id: 30, type: 'population', question: 'What is Canada\'s population?', options: ['35 million', '39 million', '43 million', '47 million'], correctAnswer: 1, explanation: 'Canada has ~39 million people' },
  
  // Comparison questions (type: 'comparison')
  { id: 31, type: 'comparison', question: 'Which country has more people: Germany or UK?', options: ['Germany', 'United Kingdom', 'They are equal', 'Cannot determine'], correctAnswer: 0, explanation: 'Germany has ~84M vs UK\'s ~67M' },
  { id: 32, type: 'comparison', question: 'Which has a larger population: Brazil or Pakistan?', options: ['Brazil', 'Pakistan', 'Equal', 'Cannot determine'], correctAnswer: 1, explanation: 'Pakistan (~240M) has overtaken Brazil (~215M)' },
  { id: 33, type: 'comparison', question: 'Who has more people: Russia or Bangladesh?', options: ['Russia', 'Bangladesh', 'Equal', 'Cannot determine'], correctAnswer: 1, explanation: 'Bangladesh (~173M) vs Russia (~143M)' },
  { id: 34, type: 'comparison', question: 'Which is more populous: Mexico or Japan?', options: ['Mexico', 'Japan', 'Equal', 'Cannot determine'], correctAnswer: 0, explanation: 'Mexico (~130M) vs Japan (~125M and declining)' },
  { id: 35, type: 'comparison', question: 'Who has more people: Nigeria or Brazil?', options: ['Nigeria', 'Brazil', 'Equal', 'Cannot determine'], correctAnswer: 0, explanation: 'Nigeria (~223M) has more people than Brazil (~215M)' },
  { id: 36, type: 'comparison', question: 'Which country is more populous: Indonesia or USA?', options: ['Indonesia', 'USA', 'Equal', 'Cannot determine'], correctAnswer: 1, explanation: 'USA (~335M) vs Indonesia (~280M)' },
  { id: 37, type: 'comparison', question: 'Who has more people: Philippines or Egypt?', options: ['Philippines', 'Egypt', 'Equal', 'Cannot determine'], correctAnswer: 0, explanation: 'Philippines (~115M) vs Egypt (~105M)' },
  { id: 38, type: 'comparison', question: 'Which is larger: Vietnam or Germany?', options: ['Vietnam', 'Germany', 'Equal', 'Cannot determine'], correctAnswer: 0, explanation: 'Vietnam (~100M) vs Germany (~84M)' },
  { id: 39, type: 'comparison', question: 'Who has more people: Turkey or Iran?', options: ['Turkey', 'Iran', 'Equal', 'Cannot determine'], correctAnswer: 0, explanation: 'Turkey (~85M) vs Iran (~87M) - actually Iran is slightly larger!' },
  { id: 40, type: 'comparison', question: 'Which country has more people: France or UK?', options: ['France', 'UK', 'Equal', 'Cannot determine'], correctAnswer: 1, explanation: 'UK (~67M) vs France (~65M)' },
  { id: 41, type: 'comparison', question: 'Who is more populous: South Korea or Spain?', options: ['South Korea', 'Spain', 'Equal', 'Cannot determine'], correctAnswer: 0, explanation: 'South Korea (~51M) vs Spain (~47M)' },
  { id: 42, type: 'comparison', question: 'Which has more people: Kenya or South Africa?', options: ['Kenya', 'South Africa', 'Equal', 'Cannot determine'], correctAnswer: 1, explanation: 'South Africa (~60M) has more people than Kenya (~54M)' },
  { id: 43, type: 'comparison', question: 'Who has more people: Canada or Australia?', options: ['Canada', 'Australia', 'Equal', 'Cannot determine'], correctAnswer: 0, explanation: 'Canada (~39M) vs Australia (~26M)' },
  { id: 44, type: 'comparison', question: 'Which country has more people: Italy or South Korea?', options: ['Italy', 'South Korea', 'Equal', 'Cannot determine'], correctAnswer: 0, explanation: 'Italy (~59M) vs South Korea (~51M)' },
  { id: 45, type: 'comparison', question: 'Who has more people: Argentina or Spain?', options: ['Argentina', 'Spain', 'Equal', 'Cannot determine'], correctAnswer: 1, explanation: 'Spain (~47M) vs Argentina (~45M)' },
  
  // Capital questions (type: 'capital')
  { id: 46, type: 'capital', question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correctAnswer: 2, explanation: 'Canberra is the capital, not Sydney!' },
  { id: 47, type: 'capital', question: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], correctAnswer: 2, explanation: 'Ottawa is the capital' },
  { id: 48, type: 'capital', question: 'What is the capital of Brazil?', options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], correctAnswer: 2, explanation: 'Brasília was built as the capital in 1960' },
  { id: 49, type: 'capital', question: 'What is the capital of Turkey?', options: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'], correctAnswer: 1, explanation: 'Ankara is the capital, not Istanbul' },
  { id: 50, type: 'capital', question: 'What is the capital of Switzerland?', options: ['Zurich', 'Geneva', 'Bern', 'Basel'], correctAnswer: 2, explanation: 'Bern is the capital' },
  { id: 51, type: 'capital', question: 'What is the capital of South Africa?', options: ['Johannesburg', 'Cape Town', 'Pretoria', 'Durban'], correctAnswer: 2, explanation: 'Pretoria is the administrative capital' },
  { id: 52, type: 'capital', question: 'What is the capital of Nigeria?', options: ['Lagos', 'Abuja', 'Kano', 'Ibadan'], correctAnswer: 1, explanation: 'Abuja became capital in 1991, replacing Lagos' },
  { id: 53, type: 'capital', question: 'What is the capital of India?', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], correctAnswer: 1, explanation: 'New Delhi is the capital' },
  { id: 54, type: 'capital', question: 'What is the capital of Japan?', options: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'], correctAnswer: 0, explanation: 'Tokyo is the capital' },
  { id: 55, type: 'capital', question: 'What is the capital of Russia?', options: ['Moscow', 'St. Petersburg', 'Novosibirsk', 'Yekaterinburg'], correctAnswer: 0, explanation: 'Moscow is the capital' },
  { id: 56, type: 'capital', question: 'What is the capital of Egypt?', options: ['Alexandria', 'Cairo', 'Giza', 'Luxor'], correctAnswer: 1, explanation: 'Cairo is the capital' },
  { id: 57, type: 'capital', question: 'What is the capital of Argentina?', options: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'], correctAnswer: 0, explanation: 'Buenos Aires is the capital' },
  { id: 58, type: 'capital', question: 'What is the capital of Thailand?', options: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya'], correctAnswer: 0, explanation: 'Bangkok is the capital' },
  { id: 59, type: 'capital', question: 'What is the capital of Kenya?', options: ['Mombasa', 'Nairobi', 'Kisumu', 'Nakuru'], correctAnswer: 1, explanation: 'Nairobi is the capital' },
  { id: 60, type: 'capital', question: 'What is the capital of Germany?', options: ['Munich', 'Frankfurt', 'Berlin', 'Hamburg'], correctAnswer: 2, explanation: 'Berlin is the capital' },
  
  // History questions (type: 'history')
  { id: 61, type: 'history', question: 'When did world population reach 1 billion?', options: ['1600', '1700', '1804', '1900'], correctAnswer: 2, explanation: 'World population hit 1 billion around 1804' },
  { id: 62, type: 'history', question: 'When did we reach 2 billion people?', options: ['1900', '1927', '1940', '1950'], correctAnswer: 1, explanation: '2 billion was reached in 1927' },
  { id: 63, type: 'history', question: 'When did world population hit 3 billion?', options: ['1950', '1959', '1968', '1974'], correctAnswer: 1, explanation: '3 billion in 1959' },
  { id: 64, type: 'history', question: 'When did we reach 4 billion people?', options: ['1968', '1974', '1987', '1999'], correctAnswer: 1, explanation: '4 billion in 1974' },
  { id: 65, type: 'history', question: 'When did world population reach 5 billion?', options: ['1974', '1987', '1999', '2011'], correctAnswer: 1, explanation: '5 billion in 1987' },
  { id: 66, type: 'history', question: 'When did we hit 6 billion?', options: ['1987', '1999', '2011', '2022'], correctAnswer: 1, explanation: '6 billion in 1999' },
  { id: 67, type: 'history', question: 'When did world population reach 7 billion?', options: ['1999', '2008', '2011', '2015'], correctAnswer: 2, explanation: '7 billion in 2011' },
  { id: 68, type: 'history', question: 'When did we reach 8 billion people?', options: ['2015', '2019', '2022', '2025'], correctAnswer: 2, explanation: '8 billion on November 15, 2022' },
  { id: 69, type: 'history', question: 'When did China implement the one-child policy?', options: ['1970', '1979', '1989', '1999'], correctAnswer: 1, explanation: 'Introduced in 1979, ended in 2016' },
  { id: 70, type: 'history', question: 'When did India overtake China in population?', options: ['2019', '2021', '2023', '2025'], correctAnswer: 2, explanation: 'India became most populous in mid-2023' },
  { id: 71, type: 'history', question: 'When did Japan\'s population start declining?', options: ['1990', '2000', '2008', '2015'], correctAnswer: 2, explanation: 'Japan\'s population peaked in 2008' },
  { id: 72, type: 'history', question: 'When was the Black Death pandemic?', options: ['1200s', '1347-1351', '1500s', '1665'], correctAnswer: 1, explanation: 'Black Death killed 75-200M people in 1347-1351' },
  { id: 73, type: 'history', question: 'When did the Spanish Flu occur?', options: ['1900-1905', '1914-1918', '1918-1920', '1929-1931'], correctAnswer: 2, explanation: 'Spanish Flu killed 50-100M in 1918-1920' },
  { id: 74, type: 'history', question: 'When did the Green Revolution begin?', options: ['1940s', '1960s', '1980s', '2000s'], correctAnswer: 1, explanation: 'Green Revolution started in the 1960s' },
  { id: 75, type: 'history', question: 'When did the Industrial Revolution begin?', options: ['1600s', '1750s', '1850s', '1900s'], correctAnswer: 1, explanation: 'Started in Britain around 1750' },
  
  // Flag questions (type: 'flag')
  { id: 76, type: 'flag', question: 'Which country has a red circle on white background?', options: ['China', 'South Korea', 'Japan', 'Vietnam'], correctAnswer: 2, explanation: 'Japan\'s flag is the "rising sun"' },
  { id: 77, type: 'flag', question: 'Which country has a maple leaf on its flag?', options: ['USA', 'Canada', 'UK', 'Australia'], correctAnswer: 1, explanation: 'Canada\'s flag features a red maple leaf' },
  { id: 78, type: 'flag', question: 'Which country has a Union Jack in the corner?', options: ['USA', 'Canada', 'Australia', 'Ireland'], correctAnswer: 2, explanation: 'Australia\'s flag has the Union Jack' },
  { id: 79, type: 'flag', question: 'Which country has a yellow star on red?', options: ['China', 'Vietnam', 'North Korea', 'All of these'], correctAnswer: 3, explanation: 'All three communist countries use this design' },
  { id: 80, type: 'flag', question: 'Which African country has a flag with green, yellow, and red?', options: ['Nigeria', 'Ethiopia', 'Kenya', 'South Africa'], correctAnswer: 1, explanation: 'Ethiopia\'s flag uses green, yellow, red' },
  { id: 81, type: 'flag', question: 'Which country has horizontal stripes of orange, white, and green?', options: ['Ireland', 'India', 'Niger', 'Ivory Coast'], correctAnswer: 1, explanation: 'India\'s flag has these colors with a wheel' },
  { id: 82, type: 'flag', question: 'Which Nordic country has a blue flag with yellow cross?', options: ['Norway', 'Denmark', 'Sweden', 'Finland'], correctAnswer: 2, explanation: 'Sweden has blue with yellow cross' },
  { id: 83, type: 'flag', question: 'Which country has a red flag with five yellow stars?', options: ['North Korea', 'China', 'Vietnam', 'Laos'], correctAnswer: 1, explanation: 'China\'s flag has one large and four small stars' },
  { id: 84, type: 'flag', question: 'Which South American country has a green and yellow flag?', options: ['Argentina', 'Brazil', 'Colombia', 'Chile'], correctAnswer: 1, explanation: 'Brazil\'s flag is green and yellow with a blue circle' },
  { id: 85, type: 'flag', question: 'Which country has a red and white striped flag with a blue canton?', options: ['UK', 'USA', 'France', 'Netherlands'], correctAnswer: 1, explanation: 'The Stars and Stripes' },
  
  // More population questions
  { id: 86, type: 'population', question: 'What is the population of Australia?', options: ['20 million', '26 million', '32 million', '38 million'], correctAnswer: 1, explanation: 'Australia has ~26 million people' },
  { id: 87, type: 'population', question: 'How many people live in Saudi Arabia?', options: ['28 million', '32 million', '36 million', '40 million'], correctAnswer: 1, explanation: 'Saudi Arabia has ~32 million people' },
  { id: 88, type: 'population', question: 'What is Morocco\'s population?', options: ['30 million', '37 million', '44 million', '51 million'], correctAnswer: 1, explanation: 'Morocco has ~37 million people' },
  { id: 89, type: 'population', question: 'How many people live in Peru?', options: ['28 million', '33 million', '38 million', '43 million'], correctAnswer: 1, explanation: 'Peru has ~33 million people' },
  { id: 90, type: 'population', question: 'What is Malaysia\'s population?', options: ['28 million', '33 million', '38 million', '43 million'], correctAnswer: 1, explanation: 'Malaysia has ~33 million people' },
  { id: 91, type: 'population', question: 'How many people live in Ghana?', options: ['28 million', '33 million', '38 million', '43 million'], correctAnswer: 1, explanation: 'Ghana has ~33 million people' },
  { id: 92, type: 'population', question: 'What is Mozambique\'s population?', options: ['26 million', '31 million', '36 million', '41 million'], correctAnswer: 1, explanation: 'Mozambique has ~31 million people' },
  { id: 93, type: 'population', question: 'How many people live in Yemen?', options: ['26 million', '34 million', '42 million', '50 million'], correctAnswer: 1, explanation: 'Yemen has ~34 million people' },
  { id: 94, type: 'population', question: 'What is Nepal\'s population?', options: ['26 million', '30 million', '34 million', '38 million'], correctAnswer: 1, explanation: 'Nepal has ~30 million people' },
  { id: 95, type: 'population', question: 'How many people live in Venezuela?', options: ['26 million', '28 million', '30 million', '32 million'], correctAnswer: 1, explanation: 'Venezuela has ~28 million people' },
  { id: 96, type: 'population', question: 'What is Cameroon\'s population?', options: ['22 million', '28 million', '34 million', '40 million'], correctAnswer: 1, explanation: 'Cameroon has ~28 million people' },
  { id: 97, type: 'population', question: 'How many people live in North Korea?', options: ['20 million', '26 million', '32 million', '38 million'], correctAnswer: 1, explanation: 'North Korea has ~26 million people' },
  { id: 98, type: 'population', question: 'What is Taiwan\'s population?', options: ['20 million', '23 million', '26 million', '29 million'], correctAnswer: 1, explanation: 'Taiwan has ~23 million people' },
  { id: 99, type: 'population', question: 'How many people live in Chile?', options: ['17 million', '19 million', '21 million', '23 million'], correctAnswer: 1, explanation: 'Chile has ~19 million people' },
  { id: 100, type: 'population', question: 'What is the Netherlands\' population?', options: ['16 million', '17.5 million', '19 million', '20.5 million'], correctAnswer: 1, explanation: 'Netherlands has ~17.5 million people' }
];

export function getRandomQuestions(count: number = 10): QuizQuestion[] {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
