import { ProblemVisualization } from '../../types/visualization';
import { topic01Visualizations } from './topic01_Arrays';
import { topic02Visualizations } from './topic02_Arrays_Part_II';
import { topic03Visualizations } from './topic03_Arrays_Part_III';
import { topic04Visualizations } from './topic04_Arrays_Part_IV';
import { topic05Visualizations } from './topic05_Linked_List';
import { topic06Visualizations } from './topic06_Linked_List_Part_II';
import { topic07Visualizations } from './topic07_Linked_List_and_Arrays';
import { topic08Visualizations } from './topic08_Greedy_Algorithm';
import { topic09Visualizations } from './topic09_Recursion';
import { topic10Visualizations } from './topic10_Recursion_and_Backtracking';
import { topic11Visualizations } from './topic11_Binary_Search';
import { topic12Visualizations } from './topic12_Heaps';
import { topic13Visualizations } from './topic13_Stack_and_Queue';
import { topic14Visualizations } from './topic14_Stack_and_Queue_Part_II';
import { topic15Visualizations } from './topic15_String';
import { topic16Visualizations } from './topic16_String_Part_II';
import { topic17Visualizations } from './topic17_Binary_Tree';
import { topic18Visualizations } from './topic18_Binary_Tree_Part_II';
import { topic19Visualizations } from './topic19_Binary_Tree_Part_III';
import { topic20Visualizations } from './topic20_Binary_Search_Tree';
import { topic21Visualizations } from './topic21_Binary_Search_Tree_Part_II';
import { topic22Visualizations } from './topic22_BT_Miscellaneous';
import { topic23Visualizations } from './topic23_Graph';
import { topic24Visualizations } from './topic24_Graph_Part_II';
import { topic25Visualizations } from './topic25_DP';
import { topic26Visualizations } from './topic26_DP_Part_II';
import { topic27Visualizations } from './topic27_Trie';

export const allVisualizations: Record<string, ProblemVisualization> = {
  ...topic01Visualizations,
  ...topic02Visualizations,
  ...topic03Visualizations,
  ...topic04Visualizations,
  ...topic05Visualizations,
  ...topic06Visualizations,
  ...topic07Visualizations,
  ...topic08Visualizations,
  ...topic09Visualizations,
  ...topic10Visualizations,
  ...topic11Visualizations,
  ...topic12Visualizations,
  ...topic13Visualizations,
  ...topic14Visualizations,
  ...topic15Visualizations,
  ...topic16Visualizations,
  ...topic17Visualizations,
  ...topic18Visualizations,
  ...topic19Visualizations,
  ...topic20Visualizations,
  ...topic21Visualizations,
  ...topic22Visualizations,
  ...topic23Visualizations,
  ...topic24Visualizations,
  ...topic25Visualizations,
  ...topic26Visualizations,
  ...topic27Visualizations,
};

export function getProblemVisualization(problemId: string, approachIndex?: number): ProblemVisualization | undefined {
  if (!problemId) return undefined;
  const normalizedId = problemId.replace(/\\/g, '/');
  const baseViz = allVisualizations[normalizedId] || allVisualizations[problemId];
  if (!baseViz) return undefined;

  if (approachIndex !== undefined && baseViz.approachVisualizations && baseViz.approachVisualizations[approachIndex]) {
    return baseViz.approachVisualizations[approachIndex];
  }
  return baseViz;
}
