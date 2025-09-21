// Simple test to verify AI analysis is working
import { analyzePlantHealth } from '../server/utils/aiAnalysis';

async function testAIAnalysis() {
  console.log('Testing AI analysis...');
  
  try {
    const result = await analyzePlantHealth('http://example.com/image.jpg');
    console.log('AI Analysis Result:', result);
    console.log('Test passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testAIAnalysis();