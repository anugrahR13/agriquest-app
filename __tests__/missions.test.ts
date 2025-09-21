import { analyzePlantHealth, comparePlantGrowth, generateCropCreditReport } from '../server/utils/aiAnalysis';

describe('AI Analysis Utilities', () => {
  describe('analyzePlantHealth', () => {
    it('should return analysis results with health score between 0 and 100', async () => {
      const result = await analyzePlantHealth('http://example.com/image.jpg');
      
      expect(result).toHaveProperty('healthScore');
      expect(result.healthScore).toBeGreaterThanOrEqual(0);
      expect(result.healthScore).toBeLessThanOrEqual(100);
      
      expect(result).toHaveProperty('leafColor');
      expect(result).toHaveProperty('density');
      expect(result).toHaveProperty('diseaseDetected');
      expect(result).toHaveProperty('growthPercent');
      expect(result).toHaveProperty('canopyCover');
      expect(result).toHaveProperty('recommendations');
    });

    it('should return recommendations array', async () => {
      const result = await analyzePlantHealth('http://example.com/image.jpg');
      
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('comparePlantGrowth', () => {
    it('should return comparison results', async () => {
      const result = await comparePlantGrowth([
        'http://example.com/image1.jpg',
        'http://example.com/image2.jpg'
      ]);
      
      expect(result).toHaveProperty('progress');
      expect(result.progress).toBeGreaterThanOrEqual(0);
      expect(result.progress).toBeLessThanOrEqual(100);
      
      expect(result).toHaveProperty('improvement');
      expect(typeof result.improvement).toBe('boolean');
      
      expect(result).toHaveProperty('notes');
      expect(typeof result.notes).toBe('string');
    });
  });

  describe('generateCropCreditReport', () => {
    it('should generate crop credit report data', async () => {
      const mockAnalyses = [
        {
          healthScore: 85,
          leafColor: "GREEN",
          density: 90,
          diseaseDetected: false,
          growthPercent: 80,
          canopyCover: 85,
          recommendations: ["Water regularly", "Apply fertilizer"]
        },
        {
          healthScore: 90,
          leafColor: "GREEN",
          density: 95,
          diseaseDetected: false,
          growthPercent: 85,
          canopyCover: 90,
          recommendations: ["Water regularly", "Prune branches"]
        }
      ];
      
      const result = await generateCropCreditReport(mockAnalyses);
      
      expect(result).toHaveProperty('healthScore');
      expect(result.healthScore).toBeGreaterThanOrEqual(0);
      expect(result.healthScore).toBeLessThanOrEqual(100);
      
      expect(result).toHaveProperty('predictedYield');
      expect(result.predictedYield).toHaveProperty('min');
      expect(result.predictedYield).toHaveProperty('max');
      expect(result.predictedYield).toHaveProperty('quality');
      
      expect(result).toHaveProperty('sustainabilityScore');
      expect(result.sustainabilityScore).toBeGreaterThanOrEqual(0);
      expect(result.sustainabilityScore).toBeLessThanOrEqual(100);
      
      expect(result).toHaveProperty('recommendations');
      expect(Array.isArray(result.recommendations)).toBe(true);
    });
  });
});