import type { CodingQuestion, Difficulty, Language } from '@/types'

// Curated, LeetCode-style problem bank. Each entry holds localized content for
// both supported languages. Every topic has at least 3 questions so users can
// pick freely (like LeetCode) and practice several of the same subject.
// `difficulty` is intrinsic to the question (easy | difficult) — it is shown as
// a badge and, in Simulation, chosen at random (the user cannot pick it).
export interface BankCodingQuestion {
  id: string
  difficulty: Difficulty
  topic: string
  content: Record<Language, CodingQuestion>
}

function q(
  id: string,
  difficulty: Difficulty,
  topic: string,
  expectedComplexity: { time: string; space: string },
  en: Omit<CodingQuestion, 'topic' | 'difficulty' | 'expectedComplexity'>,
  pt: Omit<CodingQuestion, 'topic' | 'difficulty' | 'expectedComplexity'>
): BankCodingQuestion {
  return {
    id,
    difficulty,
    topic,
    content: {
      en: { ...en, topic, difficulty, expectedComplexity },
      pt: { ...pt, topic, difficulty, expectedComplexity },
    },
  }
}

export const codingBank: BankCodingQuestion[] = [
  // ======================= HASH-MAP =======================
  q(
    'two-sum',
    'easy',
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
    'contains-duplicate',
    'easy',
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
  q(
    'group-anagrams',
    'difficult',
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
    'lru-cache',
    'difficult',
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

  // ======================= ARRAYS =======================
  q(
    'best-time-stock',
    'easy',
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
    'maximum-subarray',
    'easy',
    'arrays',
    { time: 'O(n)', space: 'O(1)' },
    {
      title: 'Maximum Subarray',
      description:
        'Given an integer array nums, find the contiguous subarray with the largest sum and return that sum.',
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has sum 6.' },
        { input: 'nums = [5,4,-1,7,8]', output: '23' },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    },
    {
      title: 'Subarray de Soma Máxima',
      description:
        'Dado um array de inteiros nums, encontre o subarray contíguo com a maior soma e retorne essa soma.',
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'O subarray [4,-1,2,1] tem soma 6.' },
        { input: 'nums = [5,4,-1,7,8]', output: '23' },
      ],
      constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    }
  ),
  q(
    'product-except-self',
    'difficult',
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
    'median-two-arrays',
    'difficult',
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

  // ======================= STRINGS =======================
  q(
    'valid-anagram',
    'easy',
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
    'valid-palindrome',
    'easy',
    'strings',
    { time: 'O(n)', space: 'O(1)' },
    {
      title: 'Valid Palindrome',
      description:
        'Given a string s, return true if it is a palindrome considering only alphanumeric characters and ignoring case.',
      examples: [
        { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
        { input: 's = "race a car"', output: 'false' },
      ],
      constraints: ['1 <= s.length <= 2 * 10^5', 's consists of printable ASCII characters.'],
    },
    {
      title: 'Palíndromo Válido',
      description:
        'Dada uma string s, retorne true se ela for um palíndromo considerando apenas caracteres alfanuméricos e ignorando maiúsculas/minúsculas.',
      examples: [
        { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" é um palíndromo.' },
        { input: 's = "race a car"', output: 'false' },
      ],
      constraints: ['1 <= s.length <= 2 * 10^5', 's contém caracteres ASCII imprimíveis.'],
    }
  ),
  q(
    'longest-palindromic-substring',
    'difficult',
    'strings',
    { time: 'O(n^2)', space: 'O(1)' },
    {
      title: 'Longest Palindromic Substring',
      description: 'Given a string s, return the longest palindromic substring in s.',
      examples: [
        { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
        { input: 's = "cbbd"', output: '"bb"' },
      ],
      constraints: ['1 <= s.length <= 1000', 's consists of digits and English letters.'],
    },
    {
      title: 'Maior Substring Palindrômica',
      description: 'Dada uma string s, retorne a maior substring palindrômica em s.',
      examples: [
        { input: 's = "babad"', output: '"bab"', explanation: '"aba" também é uma resposta válida.' },
        { input: 's = "cbbd"', output: '"bb"' },
      ],
      constraints: ['1 <= s.length <= 1000', 's contém dígitos e letras.'],
    }
  ),

  // ======================= TWO-POINTERS =======================
  q(
    'two-sum-sorted',
    'easy',
    'two-pointers',
    { time: 'O(n)', space: 'O(1)' },
    {
      title: 'Two Sum II — Input Array Is Sorted',
      description:
        'Given a 1-indexed array of integers numbers sorted in non-decreasing order and a target, return the 1-indexed positions of the two numbers that add up to target. Use only constant extra space.',
      examples: [
        { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]' },
        { input: 'numbers = [2,3,4], target = 6', output: '[1,3]' },
      ],
      constraints: ['2 <= numbers.length <= 3 * 10^4', 'numbers is sorted ascending.', 'Exactly one solution exists.'],
    },
    {
      title: 'Soma de Dois II — Array Ordenado',
      description:
        'Dado um array de inteiros numbers (indexado a partir de 1) ordenado de forma não decrescente e um target, retorne as posições (a partir de 1) dos dois números que somam target. Use apenas espaço extra constante.',
      examples: [
        { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]' },
        { input: 'numbers = [2,3,4], target = 6', output: '[1,3]' },
      ],
      constraints: ['2 <= numbers.length <= 3 * 10^4', 'numbers está ordenado de forma crescente.', 'Existe exatamente uma solução.'],
    }
  ),
  q(
    'longest-substring',
    'difficult',
    'two-pointers',
    { time: 'O(n)', space: 'O(min(n, alphabet))' },
    {
      title: 'Longest Substring Without Repeating Characters',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", length 3.' },
        { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b".' },
      ],
      constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    },
    {
      title: 'Maior Substring Sem Caracteres Repetidos',
      description: 'Dada uma string s, encontre o comprimento da maior substring sem caracteres repetidos.',
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: 'A resposta é "abc", comprimento 3.' },
        { input: 's = "bbbbb"', output: '1', explanation: 'A resposta é "b".' },
      ],
      constraints: ['0 <= s.length <= 5 * 10^4', 's contém letras, dígitos, símbolos e espaços.'],
    }
  ),
  q(
    'trapping-rain-water',
    'difficult',
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

  // ======================= TREES =======================
  q(
    'invert-binary-tree',
    'easy',
    'trees',
    { time: 'O(n)', space: 'O(n)' },
    {
      title: 'Invert Binary Tree',
      description:
        'Given the root of a binary tree, invert the tree (swap every left and right child) and return its root.',
      examples: [
        { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
        { input: 'root = []', output: '[]' },
      ],
      constraints: ['The number of nodes is in the range [0, 100].', '-100 <= Node.val <= 100'],
    },
    {
      title: 'Inverter Árvore Binária',
      description:
        'Dada a raiz de uma árvore binária, inverta a árvore (troque cada filho esquerdo e direito) e retorne sua raiz.',
      examples: [
        { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
        { input: 'root = []', output: '[]' },
      ],
      constraints: ['O número de nós está no intervalo [0, 100].', '-100 <= Node.val <= 100'],
    }
  ),
  q(
    'max-depth-tree',
    'easy',
    'trees',
    { time: 'O(n)', space: 'O(n)' },
    {
      title: 'Maximum Depth of Binary Tree',
      description:
        'Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from the root down to the farthest leaf.',
      examples: [
        { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
        { input: 'root = [1,null,2]', output: '2' },
      ],
      constraints: ['The number of nodes is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    },
    {
      title: 'Profundidade Máxima de Árvore Binária',
      description:
        'Dada a raiz de uma árvore binária, retorne sua profundidade máxima — o número de nós no caminho mais longo da raiz até a folha mais distante.',
      examples: [
        { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
        { input: 'root = [1,null,2]', output: '2' },
      ],
      constraints: ['O número de nós está no intervalo [0, 10^4].', '-100 <= Node.val <= 100'],
    }
  ),
  q(
    'level-order',
    'difficult',
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

  // ======================= DYNAMIC-PROGRAMMING =======================
  q(
    'climbing-stairs',
    'easy',
    'dynamic-programming',
    { time: 'O(n)', space: 'O(1)' },
    {
      title: 'Climbing Stairs',
      description:
        'You are climbing a staircase that takes n steps to reach the top. Each time you can climb either 1 or 2 steps. In how many distinct ways can you reach the top?',
      examples: [
        { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
        { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' },
      ],
      constraints: ['1 <= n <= 45'],
    },
    {
      title: 'Subindo Escadas',
      description:
        'Você está subindo uma escada que leva n degraus até o topo. A cada vez você pode subir 1 ou 2 degraus. De quantas formas distintas você pode chegar ao topo?',
      examples: [
        { input: 'n = 2', output: '2', explanation: '1+1 ou 2.' },
        { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2 ou 2+1.' },
      ],
      constraints: ['1 <= n <= 45'],
    }
  ),
  q(
    'coin-change',
    'difficult',
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
  q(
    'lis',
    'difficult',
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

  // ======================= GRAPHS =======================
  q(
    'flood-fill',
    'easy',
    'graphs',
    { time: 'O(m·n)', space: 'O(m·n)' },
    {
      title: 'Flood Fill',
      description:
        'Given an m x n image, a starting pixel (sr, sc), and a new color, perform a flood fill: recolor the starting pixel and every 4-directionally connected pixel of the same original color to the new color. Return the modified image.',
      examples: [
        { input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', output: '[[2,2,2],[2,2,0],[2,0,1]]' },
      ],
      constraints: ['m == image.length', 'n == image[i].length', '1 <= m, n <= 50', '0 <= color < 2^16'],
    },
    {
      title: 'Preenchimento por Inundação',
      description:
        'Dada uma imagem m x n, um pixel inicial (sr, sc) e uma nova cor, faça um flood fill: recolora o pixel inicial e todos os pixels conectados nas 4 direções com a mesma cor original para a nova cor. Retorne a imagem modificada.',
      examples: [
        { input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', output: '[[2,2,2],[2,2,0],[2,0,1]]' },
      ],
      constraints: ['m == image.length', 'n == image[i].length', '1 <= m, n <= 50', '0 <= color < 2^16'],
    }
  ),
  q(
    'num-islands',
    'difficult',
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
    'word-ladder',
    'difficult',
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

  // ======================= STACK =======================
  q(
    'valid-parentheses',
    'easy',
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
    'min-stack',
    'easy',
    'stack',
    { time: 'O(1) per op', space: 'O(n)' },
    {
      title: 'Min Stack',
      description:
        'Design a stack that supports push, pop, top, and retrieving the minimum element — all in O(1) time.',
      examples: [
        { input: 'push(-2); push(0); push(-3); getMin(); pop(); top(); getMin()', output: '-3, then top()=0, getMin()=-2' },
      ],
      constraints: ['-2^31 <= val <= 2^31 - 1', 'Methods pop, top and getMin are always called on a non-empty stack.', 'Up to 3*10^4 calls.'],
    },
    {
      title: 'Pilha com Mínimo',
      description:
        'Projete uma pilha que suporte push, pop, top e recuperar o elemento mínimo — todos em tempo O(1).',
      examples: [
        { input: 'push(-2); push(0); push(-3); getMin(); pop(); top(); getMin()', output: '-3, depois top()=0, getMin()=-2' },
      ],
      constraints: ['-2^31 <= val <= 2^31 - 1', 'pop, top e getMin são sempre chamados em uma pilha não vazia.', 'Até 3*10^4 chamadas.'],
    }
  ),
  q(
    'daily-temperatures',
    'difficult',
    'stack',
    { time: 'O(n)', space: 'O(n)' },
    {
      title: 'Daily Temperatures',
      description:
        'Given an array temperatures, return an array answer where answer[i] is the number of days you have to wait after day i to get a warmer temperature. If there is no future warmer day, answer[i] = 0.',
      examples: [
        { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
        { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]' },
      ],
      constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    },
    {
      title: 'Temperaturas Diárias',
      description:
        'Dado um array temperatures, retorne um array answer onde answer[i] é o número de dias que você precisa esperar após o dia i para ter uma temperatura mais quente. Se não houver dia mais quente no futuro, answer[i] = 0.',
      examples: [
        { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
        { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]' },
      ],
      constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    }
  ),
]

// All distinct topics (subjects), for the practice picker.
export function getCodingTopics(): string[] {
  return Array.from(new Set(codingBank.map((q) => q.topic))).sort()
}

// Bank entries for a topic (or the whole bank when topic is omitted).
export function getCodingQuestions(topic?: string): BankCodingQuestion[] {
  return codingBank.filter((q) => !topic || q.topic === topic)
}

// Lightweight list for free selection (LeetCode-style), localized titles.
export function listCoding(
  topic: string,
  language: Language
): { id: string; title: string; difficulty: Difficulty }[] {
  return getCodingQuestions(topic).map((q) => ({
    id: q.id,
    title: q.content[language].title,
    difficulty: q.difficulty,
  }))
}

// Fetch a specific question chosen by the user.
export function getCodingById(id: string, language: Language): CodingQuestion | null {
  const found = codingBank.find((q) => q.id === id)
  return found ? found.content[language] : null
}

// Random question (random difficulty) — used by Simulation, where the user
// cannot choose. Avoids ids already used this session, optionally within a topic.
export function getRandomCoding(
  language: Language,
  usedIds: string[] = [],
  topic?: string
): { id: string; question: CodingQuestion } | null {
  const pool = getCodingQuestions(topic).filter((q) => !usedIds.includes(q.id))
  const source = pool.length > 0 ? pool : getCodingQuestions(topic)
  if (source.length === 0) return null
  const chosen = source[Math.floor(Math.random() * source.length)]
  return { id: chosen.id, question: chosen.content[language] }
}
