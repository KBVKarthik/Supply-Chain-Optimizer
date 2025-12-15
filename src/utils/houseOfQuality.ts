import { HouseOfQuality, TechnicalRequirement, CustomerNeed } from '../types';

// Generate House of Quality matrix
export const generateHouseOfQuality = (
  customerNeeds: CustomerNeed[],
  technicalRequirements: TechnicalRequirement[]
): HouseOfQuality => {
  const relationshipMatrix: number[][] = [];

  // Create relationship matrix (random for demo, scale 0-3)
  for (let i = 0; i < customerNeeds.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < technicalRequirements.length; j++) {
      row.push(Math.random() > 0.5 ? Math.ceil(Math.random() * 3) : 0);
    }
    relationshipMatrix.push(row);
  }

  // Calculate priority scores based on importance and relationships
  const priorityScores = technicalRequirements.map((req) => {
    let score = 0;
    for (let i = 0; i < customerNeeds.length; i++) {
      score +=
        customerNeeds[i].importance * relationshipMatrix[i][technicalRequirements.indexOf(req)];
    }
    return score;
  });

  return {
    customerNeeds,
    technicalRequirements,
    relationshipMatrix,
    priorityScores,
  };
};

// Calculate technical requirement priorities
export const calculateTechPriorities = (
  matrix: number[][],
  customerImportance: number[]
): number[] => {
  const priorities: number[] = [];

  if (matrix.length === 0) return priorities;

  const cols = matrix[0].length;
  for (let j = 0; j < cols; j++) {
    let score = 0;
    for (let i = 0; i < matrix.length; i++) {
      score += matrix[i][j] * customerImportance[i];
    }
    priorities.push(score);
  }

  return priorities;
};

// Normalize priorities to 0-100 scale
export const normalizePriorities = (scores: number[]): number[] => {
  const max = Math.max(...scores, 1);
  return scores.map((s) => (s / max) * 100);
};

// Generate recommendations based on HoQ analysis
export const generateRecommendationsFromHoQ = (
  hoq: HouseOfQuality
): string[] => {
  const recommendations: string[] = [];
  const sortedIndices = hoq.priorityScores
    .map((score, index) => ({ score, index }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.index);

  for (let i = 0; i < Math.min(5, sortedIndices.length); i++) {
    const index = sortedIndices[i];
    const req = hoq.technicalRequirements[index];
    recommendations.push(
      `Focus on improving ${req.name} - currently has the highest impact on customer satisfaction`
    );
  }

  return recommendations;
};
