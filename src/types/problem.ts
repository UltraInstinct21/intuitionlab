export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
  raw?: string;
}

export interface ProblemApproach {
  name: string;
  description: string;
  pythonCode: string;
  cppCode: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface Problem {
  id: string;
  slug: string;
  topicFolder: string;
  topicTitle: string;
  topicIndex: number;
  number: number | null;
  title: string;
  difficulty: Difficulty;
  leetcodeUrl: string;
  tags: string[];
  expectedComplexities: {
    time: string;
    space: string;
  };
  intuition: string;
  approachOverview?: string;
  problemStatement: string;
  examples: ProblemExample[];
  constraints: string[];
  approaches: ProblemApproach[];
  keyInsight: string;
}

export interface TopicProblemSummary {
  id: string;
  slug: string;
  number: number | null;
  title: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface Topic {
  id: string;
  index: number;
  title: string;
  count: number;
  problems: TopicProblemSummary[];
}
