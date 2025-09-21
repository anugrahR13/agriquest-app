"use strict";
/**
 * Demonstration script showing how to use both TensorFlow.js and Google Vision API
 * for plant health analysis in the AgriQuest application
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aiAnalysis_1 = require("./server/utils/aiAnalysis");
function demonstrateAIUsage() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 AgriQuest AI Analysis Demonstration 🌱\n');
        // Example 1: Basic plant health analysis
        console.log('1. Analyzing plant health from image...');
        try {
            const healthResult = yield (0, aiAnalysis_1.analyzePlantHealth)('https://example.com/farm-image.jpg');
            console.log('   Health Score:', healthResult.healthScore);
            console.log('   Leaf Color:', healthResult.leafColor);
            console.log('   Disease Detected:', healthResult.diseaseDetected);
            if (healthResult.diseaseType) {
                console.log('   Disease Type:', healthResult.diseaseType);
            }
            console.log('   Recommendations:', healthResult.recommendations.slice(0, 2).join(', '));
            console.log('   ✅ Analysis completed successfully\n');
        }
        catch (error) {
            console.error('   ❌ Analysis failed:', error.message);
        }
        // Example 2: Comparing plant growth over time
        console.log('2. Comparing plant growth across multiple images...');
        try {
            const growthResult = yield (0, aiAnalysis_1.comparePlantGrowth)([
                'https://example.com/plant-week1.jpg',
                'https://example.com/plant-week2.jpg',
                'https://example.com/plant-week3.jpg'
            ]);
            console.log('   Growth Progress:', growthResult.progress + '%');
            console.log('   Improvement:', growthResult.improvement ? 'Yes' : 'No');
            console.log('   Notes:', growthResult.notes);
            console.log('   ✅ Growth comparison completed successfully\n');
        }
        catch (error) {
            console.error('   ❌ Growth comparison failed:', error.message);
        }
        // Example 3: Generating a crop credit report
        console.log('3. Generating crop credit report...');
        try {
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
            const reportResult = yield (0, aiAnalysis_1.generateCropCreditReport)(mockAnalyses);
            console.log('   Average Health Score:', reportResult.healthScore);
            console.log('   Predicted Yield:', reportResult.predictedYield.min + '-' + reportResult.predictedYield.max + ' kg');
            console.log('   Yield Quality:', reportResult.predictedYield.quality);
            console.log('   Sustainability Score:', reportResult.sustainabilityScore);
            console.log('   Top Recommendations:', reportResult.recommendations.join(', '));
            console.log('   ✅ Crop credit report generated successfully\n');
        }
        catch (error) {
            console.error('   ❌ Report generation failed:', error.message);
        }
        console.log('🎯 AI Analysis Demonstration Complete!');
        console.log('\n📝 Notes:');
        console.log('- By default, TensorFlow.js is used for analysis');
        console.log('- To use Google Vision API instead:');
        console.log('  1. Set GOOGLE_VISION_ENABLED=true in your environment');
        console.log('  2. Provide Google Cloud credentials');
        console.log('- Both implementations provide the same interface and return consistent results');
        console.log('- Automatic fallback to mock implementation when AI services are unavailable');
    });
}
// Run the demonstration
demonstrateAIUsage();
