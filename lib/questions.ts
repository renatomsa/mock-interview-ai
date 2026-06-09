import type { Language } from '@/types'

const questionsEN = [
  'Tell me about a recent technical challenge you faced and how you overcame it.',
  'Describe a time you had to work under pressure to deliver on a deadline.',
  'Tell me about a project you\'re proud of and your specific contribution.',
  'How do you handle disagreements with a teammate about a technical approach?',
  'Describe your debugging process when you can\'t immediately find the cause of a bug.',
  'Tell me about a time you had to explain something technical to a non-technical person.',
  'What\'s the most valuable lesson you\'ve learned from a mistake at work or in a project?',
  'How do you prioritize when multiple tasks are competing for your attention?',
]

const questionsPT = [
  'Me conte sobre um desafio técnico recente que você enfrentou e como o superou.',
  'Descreva uma situação em que precisou trabalhar sob pressão para cumprir um prazo.',
  'Me fale sobre um projeto do qual você tem orgulho e qual foi a sua contribuição específica.',
  'Como você lida com divergências com um colega de equipe sobre uma abordagem técnica?',
  'Descreva seu processo de depuração quando não consegue encontrar imediatamente a causa de um bug.',
  'Me conte sobre uma vez em que precisou explicar algo técnico para uma pessoa não técnica.',
  'Qual é a lição mais valiosa que você aprendeu com um erro no trabalho ou em um projeto?',
  'Como você prioriza quando múltiplas tarefas estão competindo pela sua atenção?',
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getRandomQuestions(language: Language): string[] {
  const bank = language === 'pt' ? questionsPT : questionsEN
  return shuffle(bank).slice(0, 3)
}
