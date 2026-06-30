import type { CodingQuestion, Language, Level } from '@/types'

// Curated, LeetCode-style problem bank. Each entry holds localized content for
// both supported languages so the same calibrated problem can be served in PT
// or EN. `level` maps to LeetCode difficulty (junior=easy, mid=medium,
// senior=hard) and `topic` groups problems so the user can practice a subject.
export interface BankCodingQuestion {
  id: string
  level: Level
  topic: string
  content: Record<Language, CodingQuestion>
}

// Helper to keep entries terse: shared structural fields + localized strings.
function q(
  id: string,
  level: Level,
  topic: string,
  expectedComplexity: { time: string; space: string },
  en: Omit<CodingQuestion, 'topic' | 'expectedComplexity'>,
  pt: Omit<CodingQuestion, 'topic' | 'expectedComplexity'>
): BankCodingQuestion {
  return {
    id,
    level,
    topic,
    content: {
      en: { ...en, topic, expectedComplexity },
      pt: { ...pt, topic, expectedComplexity },
    },
  }
}

export const codingBank: BankCodingQuestion[] = [
  // ---------------- JUNIOR (easy) ----------------
  q(
    'two-sum',
    'junior',
    'hash-map',
    { time: 'O(n)', space: 'O(n)' },
    {
      title: 'Two Sum',
      description:
        'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Each input has exactly one solution, and you may not use the same element twice.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9.' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      ],
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists.'],
    },
    {
      title: 'Soma de Dois',
      description:
        'Dado um array de inteiros nums e um inteiro target, retorne os índices dos dois números que somam target. Cada entrada tem exatamente uma solução, e você não pode usar o mesmo elemento duas vezes.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9.' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      ],
      constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Existe exatamente uma resposta válida.'],
    }
  ),
  q(
    'valid-anagram',
    'junior',
    'strings',
    { time: 'O(n)', space: 'O(1)' },
    {
      title: 'Valid Anagram',
      description:
        'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram uses all the original letters exactly once.',
      examples: [
        { input: 's = "anagram", t = "nagaram"', output: 'true' },
        { input: 's = "rat", t = "car"', output: 'false' },
      ],
      constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    },
    {
      title: 'Anagrama Válido',
      description:
        'Dadas duas strings s e t, retorne true se t for um anagrama de s, e false caso contrário. Um anagrama usa todas as letras originais exatamente uma vez.',
      examples: [
        { input: 's = "anagram", t = "nagaram"', output: 'true' },
        { input: 's = "rat", t = "car"', output: 'false' },
      ],
      constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's e t contêm apenas letras minúsculas.'],
    }
  ),
  q(
    'best-time-stock',
    'junior',
    'arrays',
    { time: 'O(n)', space: 'O(1)' },
    {
      title: 'Best Time to Buy and Sell Stock',
      description:
        'You are given an array prices where prices[i] is the price of a stock on day i. Maximize your profit by choosing a single day to buy and a later day to sell. Return the maximum profit, or 0 if no profit is possible.',
      examples: [
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price 1), sell on day 5 (price 6).' },
        { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profitable transaction exists.' },
      ],
      constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    },
    {
      title: 'Melhor Momento para Comprar e Vender Ações',
      description:
        'Você recebe um array prices onde prices[i] é o preço de uma ação no dia i. Maximize seu lucro escolhendo um dia para comprar e um dia posterior para vender. Retorne o lucro máximo, ou 0 se nenhum lucro for possível.',
      examples: [
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Compre no dia 2 (preço 1), venda no dia 5 (preço 6).' },
        { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'Nenhuma transação lucrativa existe.' },
      ],
      constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    }
  ),
  q(
    'valid-parentheses',
    'junior',
    'stack',
    { time: 'O(n)', space: 'O(n)' },
    {
      title: 'Valid Parentheses',
      description:
        "Given a string s containing only the characters '()[]{}', determine if the input string is valid. Brackets must be closed in the correct order and by the matching type.",
      examples: [
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' },
      ],
      constraints: ['1 <= s.length <= 10^4', "s consists only of '()[]{}'."],
    },
    {
      title: 'Parênteses Válidos',
      description:
        "Dada uma string s contendo apenas os caracteres '()[]{}', determine se a string é válida. Os colchetes devem ser fechados na ordem correta e pelo tipo correspondente.",
      examples: [
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' },
      ],
      constraints: ['1 <= s.length <= 10^4', "s contém apenas '()[]{}'."],
    }
  ),
  q(
    'contains-duplicate',
    'junior',
    'hash-map',
    { time: 'O(n)', space: 'O(n)' },
    {
      title: 'Contains Duplicate',
      description:
        'Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.',
      examples: [
        { input: 'nums = [1,2,3,1]', output: 'true' },
        { input: 'nums = [1,2,3,4]', output: 'false' },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    },
    {
      title: 'Contém Duplicata',
      description:
        'Dado um array de inteiros nums, retorne true se algum valor aparecer pelo menos duas vezes, e false se todos os elementos forem distintos.',
      examples: [
        { input: 'nums = [1,2,3,1]', output: 'true' },
        { input: 'nums = [1,2,3,4]', output: 'false' },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    }
  ),

  // ---------------- MID (medium) ----------------
  q(
    'group-anagrams',
    'mid',
    'hash-map',
    { time: 'O(n·k log k)', space: 'O(n·k)' },
    {
      title: 'Group Anagrams',
      description:
        'Given an array of strings strs, group the anagrams together. You may return the answer in any order.',
      examples: [
        { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      ],
      constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase letters.'],
    },
    {
      title: 'Agrupar Anagramas',
      description:
        'Dado um array de strings strs, agrupe os anagramas. Você pode retornar a resposta em qualquer ordem.',
      examples: [
        { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      ],
      constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] contém apenas letras minúsculas.'],
    }
  ),
  q(
    'longest-substring',
    'mid',
    'two-pointers',
    { time: 'O(n)', space: 'O(min(n, alphabet))' },
    {
      title: 'Longest Substring Without Repeating Characters',
      description:
        'Given a string s, find the length of the longest substring without repeating characters.',
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", length 3.' },
        { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b".' },
      ],
      constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    },
    {
      title: 'Maior Substring Sem Caracteres Repetidos',
      description:
        'Dada uma string s, encontre o comprimento da maior substring sem caracteres repetidos.',
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: 'A resposta é "abc", comprimento 3.' },
        { input: 's = "bbbbb"', output: '1', explanation: 'A resposta é "b".' },
      ],
      constraints: ['0 <= s.length <= 5 * 10^4', 's contém letras, dígitos, símbolos e espaços.'],
    }
  ),
  q(
    'product-except-self',
    'mid',
    'arrays',
    { time: 'O(n)', space: 'O(1)' },
    {
      title: 'Product of Array Except Self',
      description:
        'Given an integer array nums, return an array answer where answer[i] is the product of all elements of nums except nums[i]. You must solve it without using division and in O(n) time.',
      examples: [
        { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
        { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
      ],
      constraints: ['2 <= nums.length <= 10^5', 'The product fits in a 32-bit integer.', 'No division allowed.'],
    },
    {
      title: 'Produto do Array Exceto Si Mesmo',
      description:
        'Dado um array de inteiros nums, retorne um array answer onde answer[i] é o produto de todos os elementos de nums exceto nums[i]. Resolva sem usar divisão e em tempo O(n).',
      examples: [
        { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
        { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
      ],
      constraints: ['2 <= nums.length <= 10^5', 'O produto cabe em um inteiro de 32 bits.', 'Divisão não é permitida.'],
    }
  ),
  q(
    'level-order',
    'mid',
    'trees',
    { time: 'O(n)', space: 'O(n)' },
    {
      title: 'Binary Tree Level Order Traversal',
      description:
        "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
      examples: [
        { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
        { input: 'root = [1]', output: '[[1]]' },
      ],
      constraints: ['The number of nodes is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    },
    {
      title: 'Travessia em Largura de Árvore Binária',
      description:
        'Dada a raiz de uma árvore binária, retorne a travessia em largura dos valores dos nós (da esquerda para a direita, nível por nível).',
      examples: [
        { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
        { input: 'root = [1]', output: '[[1]]' },
      ],
      constraints: ['O número de nós está no intervalo [0, 2000].', '-1000 <= Node.val <= 1000'],
    }
  ),
  q(
    'num-islands',
    'mid',
    'graphs',
    { time: 'O(m·n)', space: 'O(m·n)' },
    {
      title: 'Number of Islands',
      description:
        "Given an m x n grid of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent land horizontally or vertically.",
      examples: [
        { input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: '2' },
      ],
      constraints: ['1 <= m, n <= 300', "grid[i][j] is '0' or '1'."],
    },
    {
      title: 'Número de Ilhas',
      description:
        "Dada uma grade m x n de '1's (terra) e '0's (água), retorne o número de ilhas. Uma ilha é cercada por água e formada conectando terras adjacentes na horizontal ou vertical.",
      examples: [
        { input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: '2' },
      ],
      constraints: ['1 <= m, n <= 300', "grid[i][j] é '0' ou '1'."],
    }
  ),
  q(
    'coin-change',
    'mid',
    'dynamic-programming',
    { time: 'O(amount·coins)', space: 'O(amount)' },
    {
      title: 'Coin Change',
      description:
        'You are given coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount, or -1 if it cannot be made. You have an infinite supply of each coin.',
      examples: [
        { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1.' },
        { input: 'coins = [2], amount = 3', output: '-1' },
      ],
      constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    },
    {
      title: 'Troco de Moedas',
      description:
        'Você recebe moedas de diferentes denominações e um inteiro amount. Retorne o menor número de moedas necessário para formar esse valor, ou -1 se não for possível. Você tem suprimento infinito de cada moeda.',
      examples: [
        { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1.' },
        { input: 'coins = [2], amount = 3', output: '-1' },
      ],
      constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    }
  ),

  // ---------------- SENIOR (hard) ----------------
  q(
    'trapping-rain-water',
    'senior',
    'two-pointers',
    { time: 'O(n)', space: 'O(1)' },
    {
      title: 'Trapping Rain Water',
      description:
        'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
      examples: [
        { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
        { input: 'height = [4,2,0,3,2,5]', output: '9' },
      ],
      constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    },
    {
      title: 'Capturar Água da Chuva',
      description:
        'Dados n inteiros não negativos representando um mapa de elevação onde a largura de cada barra é 1, calcule quanta água pode ser capturada após a chuva.',
      examples: [
        { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
        { input: 'height = [4,2,0,3,2,5]', output: '9' },
      ],
      constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    }
  ),
  q(
    'word-ladder',
    'senior',
    'graphs',
    { time: 'O(N·L^2)', space: 'O(N·L)' },
    {
      title: 'Word Ladder',
      description:
        'Given two words beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, changing one letter at a time where each intermediate word must exist in wordList. Return 0 if no such sequence exists.',
      examples: [
        { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit -> hot -> dot -> dog -> cog.' },
      ],
      constraints: ['1 <= beginWord.length <= 10', '1 <= wordList.length <= 5000', 'All words have the same length.'],
    },
    {
      title: 'Escada de Palavras',
      description:
        'Dadas duas palavras beginWord e endWord, e um dicionário wordList, retorne o número de palavras na menor sequência de transformação de beginWord até endWord, mudando uma letra por vez, onde cada palavra intermediária deve existir em wordList. Retorne 0 se não existir tal sequência.',
      examples: [
        { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit -> hot -> dot -> dog -> cog.' },
      ],
      constraints: ['1 <= beginWord.length <= 10', '1 <= wordList.length <= 5000', 'Todas as palavras têm o mesmo comprimento.'],
    }
  ),
  q(
    'lis',
    'senior',
    'dynamic-programming',
    { time: 'O(n log n)', space: 'O(n)' },
    {
      title: 'Longest Increasing Subsequence',
      description:
        'Given an integer array nums, return the length of the longest strictly increasing subsequence. Aim for an O(n log n) solution.',
      examples: [
        { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'The LIS is [2,3,7,101].' },
        { input: 'nums = [0,1,0,3,2,3]', output: '4' },
      ],
      constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    },
    {
      title: 'Maior Subsequência Crescente',
      description:
        'Dado um array de inteiros nums, retorne o comprimento da maior subsequência estritamente crescente. Busque uma solução O(n log n).',
      examples: [
        { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'A LIS é [2,3,7,101].' },
        { input: 'nums = [0,1,0,3,2,3]', output: '4' },
      ],
      constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    }
  ),
  q(
    'median-two-arrays',
    'senior',
    'arrays',
    { time: 'O(log(min(m,n)))', space: 'O(1)' },
    {
      title: 'Median of Two Sorted Arrays',
      description:
        'Given two sorted arrays nums1 and nums2 of sizes m and n, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).',
      examples: [
        { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'Merged = [1,2,3], median 2.' },
        { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5' },
      ],
      constraints: ['0 <= m, n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums[i] <= 10^6'],
    },
    {
      title: 'Mediana de Dois Arrays Ordenados',
      description:
        'Dados dois arrays ordenados nums1 e nums2 de tamanhos m e n, retorne a mediana dos dois arrays. A complexidade de tempo deve ser O(log(m+n)).',
      examples: [
        { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'Combinado = [1,2,3], mediana 2.' },
        { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5' },
      ],
      constraints: ['0 <= m, n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums[i] <= 10^6'],
    }
  ),
  q(
    'lru-cache',
    'senior',
    'hash-map',
    { time: 'O(1) per op', space: 'O(capacity)' },
    {
      title: 'LRU Cache',
      description:
        'Design a data structure for a Least Recently Used (LRU) cache. Implement get(key) and put(key, value) in O(1) average time. When capacity is exceeded, evict the least recently used key.',
      examples: [
        { input: 'capacity = 2; put(1,1); put(2,2); get(1); put(3,3); get(2)', output: 'get(1)=1, get(2)=-1', explanation: 'Key 2 was evicted when 3 was added.' },
      ],
      constraints: ['1 <= capacity <= 3000', '0 <= key, value <= 10^4', 'get and put are called up to 2*10^5 times.'],
    },
    {
      title: 'Cache LRU',
      description:
        'Projete uma estrutura de dados para um cache LRU (Least Recently Used). Implemente get(key) e put(key, value) em tempo médio O(1). Quando a capacidade é excedida, remova a chave usada menos recentemente.',
      examples: [
        { input: 'capacity = 2; put(1,1); put(2,2); get(1); put(3,3); get(2)', output: 'get(1)=1, get(2)=-1', explanation: 'A chave 2 foi removida quando 3 foi adicionada.' },
      ],
      constraints: ['1 <= capacity <= 3000', '0 <= key, value <= 10^4', 'get e put são chamadas até 2*10^5 vezes.'],
    }
  ),
]

// All distinct topics available, for building a "practice this subject" picker.
export function getCodingTopics(level?: Level): string[] {
  const pool = level ? codingBank.filter((q) => q.level === level) : codingBank
  return Array.from(new Set(pool.map((q) => q.topic))).sort()
}

// Filter the bank by level and optional topic.
export function getCodingQuestions(level: Level, topic?: string): BankCodingQuestion[] {
  return codingBank.filter((q) => q.level === level && (!topic || q.topic === topic))
}

// Pick a random localized question for a level/topic, avoiding ids already used
// this session. Returns null when the bank has nothing matching (caller may
// then fall back to AI generation).
export function getRandomCoding(
  level: Level,
  language: Language,
  usedIds: string[] = [],
  topic?: string
): { id: string; question: CodingQuestion } | null {
  const pool = getCodingQuestions(level, topic).filter((q) => !usedIds.includes(q.id))
  const source = pool.length > 0 ? pool : getCodingQuestions(level, topic)
  if (source.length === 0) return null
  const chosen = source[Math.floor(Math.random() * source.length)]
  return { id: chosen.id, question: chosen.content[language] }
}
