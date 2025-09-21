"use strict";
/**
 * AI Analysis Utility for Plant Health Detection
 * This implementation uses TensorFlow.js for client-side inference
 * Can be extended to use external AI services like Google Vision API
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePlantHealth = analyzePlantHealth;
exports.comparePlantGrowth = comparePlantGrowth;
exports.generateCropCreditReport = generateCropCreditReport;
// Import TensorFlow.js and models
const tf = __importStar(require("@tensorflow/tfjs"));
// @ts-ignore
const mobilenet = __importStar(require("@tensorflow-models/mobilenet"));
// @ts-ignore
const cocoSsd = __importStar(require("@tensorflow-models/coco-ssd"));
// Import Google Vision API
const vision_1 = __importDefault(require("@google-cloud/vision"));
/**
 * Initialize TensorFlow.js models
 */
let mobilenetModel = null;
let cocoSsdModel = null;
function initializeModels() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!mobilenetModel) {
            try {
                // Warm up the models
                yield tf.ready();
                mobilenetModel = yield mobilenet.load();
                cocoSsdModel = yield cocoSsd.load();
            }
            catch (error) {
                console.error('Error loading TensorFlow.js models:', error);
                // Fallback to mock implementation
                mobilenetModel = null;
                cocoSsdModel = null;
            }
        }
    });
}
/**
 * Analyze plant health from an image URL using TensorFlow.js or Google Vision API
 * @param imageUrl URL of the image to analyze
 * @returns Analysis results
 */
function analyzePlantHealth(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if we should use Google Vision API (based on environment variable)
            const useGoogleVision = process.env.GOOGLE_VISION_ENABLED === 'true';
            if (useGoogleVision) {
                return yield analyzeWithGoogleVision(imageUrl);
            }
            // Initialize models if not already loaded
            yield initializeModels();
            // If models are not available, fallback to mock implementation
            if (!mobilenetModel || !cocoSsdModel) {
                return mockAnalysis(imageUrl);
            }
            // Load image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageUrl;
            // Wait for image to load
            yield new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            // Run image through MobileNet for general classification
            const predictions = yield mobilenetModel.classify(img);
            // Run image through COCO-SSD for object detection
            const detections = yield cocoSsdModel.detect(img);
            // Analyze results
            const plantHealth = analyzePlantDetections(detections, predictions);
            return plantHealth;
        }
        catch (error) {
            console.error('Error in AI analysis:', error);
            // Fallback to mock implementation
            return mockAnalysis(imageUrl);
        }
    });
}
/**
 * Analyze plant health using Google Vision API
 * @param imageUrl URL of the image to analyze
 * @returns Analysis results
 */
function analyzeWithGoogleVision(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Initialize Google Vision client
            const client = new vision_1.default.ImageAnnotatorClient({
                keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            });
            // Perform label detection
            const [labelResult] = yield client.labelDetection(imageUrl);
            const labels = labelResult.labelAnnotations || [];
            // Perform object localization
            const [objectResult] = yield (client.objectLocalization ? client.objectLocalization(imageUrl) : [{ localizedObjectAnnotations: [] }]);
            const objects = objectResult.localizedObjectAnnotations || [];
            // Perform crop hints
            const [cropResult] = yield (client.cropHints ? client.cropHints(imageUrl) : [{ cropHintsAnnotation: { cropHints: [] } }]);
            const cropHints = ((_a = cropResult.cropHintsAnnotation) === null || _a === void 0 ? void 0 : _a.cropHints) || [];
            // Analyze results
            const plantHealth = analyzeGoogleVisionResults(labels, objects, cropHints);
            return plantHealth;
        }
        catch (error) {
            console.error('Error in Google Vision analysis:', error);
            // Fallback to mock implementation
            return mockAnalysis(imageUrl);
        }
    });
}
/**
 * Analyze Google Vision API results
 * @param labels Label annotations from Google Vision
 * @param objects Object annotations from Google Vision
 * @param cropHints Crop hints from Google Vision
 * @returns Analysis results
 */
function analyzeGoogleVisionResults(labels, objects, cropHints) {
    // Look for plant-related labels
    const plantLabels = labels.filter(label => {
        var _a, _b, _c, _d, _e;
        return ((_a = label.description) === null || _a === void 0 ? void 0 : _a.includes('plant')) ||
            ((_b = label.description) === null || _b === void 0 ? void 0 : _b.includes('leaf')) ||
            ((_c = label.description) === null || _c === void 0 ? void 0 : _c.includes('tree')) ||
            ((_d = label.description) === null || _d === void 0 ? void 0 : _d.includes('grass')) ||
            ((_e = label.description) === null || _e === void 0 ? void 0 : _e.includes('vegetation'));
    });
    // Look for disease or unhealthy indicators in labels
    const unhealthyLabels = labels.filter(label => {
        var _a, _b, _c, _d;
        return ((_a = label.description) === null || _a === void 0 ? void 0 : _a.includes('wilt')) ||
            ((_b = label.description) === null || _b === void 0 ? void 0 : _b.includes('disease')) ||
            ((_c = label.description) === null || _c === void 0 ? void 0 : _c.includes('dead')) ||
            ((_d = label.description) === null || _d === void 0 ? void 0 : _d.includes('dry')) ||
            (label.score && label.score < 0.5);
    });
    // Calculate health score based on labels and objects
    const baseScore = plantLabels.length > 0 ? 80 : 40;
    const healthScore = Math.min(100, Math.max(0, baseScore - (unhealthyLabels.length * 10)));
    // Determine leaf color based on labels
    let leafColor = "GREEN";
    if (healthScore < 50) {
        leafColor = "BROWN";
    }
    else if (healthScore < 70) {
        leafColor = "YELLOW";
    }
    // Calculate density based on number of plant objects detected
    const density = Math.min(100, objects.length * 20);
    // Check for disease detection
    const diseaseDetected = unhealthyLabels.length > 0;
    const diseaseType = diseaseDetected ? "Possible Plant Disease" : undefined;
    // Estimate growth percent based on object sizes
    const growthPercent = Math.min(100, objects.reduce((sum, obj) => sum + ((obj.score || 0) * 100), 0) / Math.max(1, objects.length));
    // Estimate canopy cover based on crop hints
    const canopyCover = Math.min(100, cropHints.length > 0 ? (cropHints[0].confidence || 0) * 100 : 50);
    // Generate recommendations
    const recommendations = generateRecommendations(healthScore > 70, diseaseDetected);
    return {
        healthScore,
        leafColor,
        density,
        diseaseDetected,
        diseaseType,
        growthPercent,
        canopyCover,
        recommendations
    };
}
/**
 * Analyze plant detections and predictions
 * @param detections COCO-SSD detections
 * @param predictions MobileNet predictions
 * @returns Analysis results
 */
function analyzePlantDetections(detections, predictions) {
    // Look for plant-related objects in detections
    const plantObjects = detections.filter(detection => detection.class.includes('plant') ||
        detection.class.includes('leaf') ||
        detection.class.includes('tree') ||
        detection.class.includes('grass'));
    // Look for disease or unhealthy indicators in predictions
    const unhealthyPredictions = predictions.filter(pred => pred.className.includes('wilt') ||
        pred.className.includes('disease') ||
        pred.className.includes('dead') ||
        pred.className.includes('dry') ||
        pred.probability < 0.5);
    // Calculate health score based on detections and predictions
    const baseScore = plantObjects.length > 0 ? 80 : 40;
    const healthScore = Math.min(100, Math.max(0, baseScore - (unhealthyPredictions.length * 10)));
    // Determine leaf color based on predictions
    let leafColor = "GREEN";
    if (healthScore < 50) {
        leafColor = "BROWN";
    }
    else if (healthScore < 70) {
        leafColor = "YELLOW";
    }
    // Calculate density based on number of plant objects detected
    const density = Math.min(100, plantObjects.length * 20);
    // Check for disease detection
    const diseaseDetected = unhealthyPredictions.length > 0;
    const diseaseType = diseaseDetected ? "Possible Plant Disease" : undefined;
    // Estimate growth percent based on object sizes
    const growthPercent = Math.min(100, plantObjects.reduce((sum, obj) => sum + (obj.score * 100), 0) / Math.max(1, plantObjects.length));
    // Estimate canopy cover based on bounding box areas
    const canopyCover = Math.min(100, plantObjects.reduce((sum, obj) => {
        const area = obj.bbox[2] * obj.bbox[3]; // width * height
        return sum + (area / 10000); // Normalize
    }, 0));
    // Generate recommendations
    const recommendations = generateRecommendations(healthScore > 70, diseaseDetected);
    return {
        healthScore,
        leafColor,
        density,
        diseaseDetected,
        diseaseType,
        growthPercent,
        canopyCover,
        recommendations
    };
}
/**
 * Mock analysis for fallback when AI services are not available
 * @param imageUrl URL of the image to analyze
 * @returns Mock analysis results
 */
function mockAnalysis(imageUrl) {
    // In a real implementation, this would:
    // 1. Download the image from the URL
    // 2. Process it through an AI model
    // 3. Return structured analysis results
    // For now, we'll return mock results with some randomness
    const isHealthy = Math.random() > 0.3; // 70% chance of being healthy
    const hasDisease = !isHealthy && Math.random() > 0.5; // 50% chance of disease if not healthy
    return {
        healthScore: isHealthy ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 60) + 20,
        leafColor: isHealthy ? "GREEN" : (Math.random() > 0.5 ? "YELLOW" : "BROWN"),
        density: isHealthy ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 50) + 30,
        diseaseDetected: hasDisease,
        diseaseType: hasDisease ? (Math.random() > 0.5 ? "Rust" : "Blight") : undefined,
        growthPercent: isHealthy ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 50) + 20,
        canopyCover: isHealthy ? Math.floor(Math.random() * 25) + 75 : Math.floor(Math.random() * 50) + 30,
        recommendations: generateRecommendations(isHealthy, hasDisease)
    };
}
/**
 * Generate recommendations based on analysis results
 * @param isHealthy Whether the plant is healthy
 * @param hasDisease Whether a disease was detected
 * @returns Array of recommendations
 */
function generateRecommendations(isHealthy, hasDisease) {
    const recommendations = [];
    if (!isHealthy) {
        recommendations.push("Increase watering frequency to improve plant health");
        recommendations.push("Apply organic fertilizer to boost nutrient levels");
    }
    if (hasDisease) {
        recommendations.push("Apply appropriate fungicide treatment immediately");
        recommendations.push("Remove and destroy infected plant parts to prevent spread");
    }
    if (isHealthy) {
        recommendations.push("Maintain current care routine for optimal growth");
        recommendations.push("Monitor for pests and diseases regularly");
    }
    // Always add general recommendations
    recommendations.push("Ensure proper spacing between plants for air circulation");
    recommendations.push("Mulch around plants to retain soil moisture");
    return recommendations;
}
/**
 * Analyze multiple images for comparison
 * @param imageUrls Array of image URLs to analyze
 * @returns Comparison analysis results
 */
function comparePlantGrowth(imageUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        // Mock implementation for growth comparison
        const progress = Math.floor(Math.random() * 30) + 70; // 70-100% progress
        const improvement = progress > 80;
        return {
            progress,
            improvement,
            notes: improvement
                ? "Plant health is improving compared to previous stages"
                : "Plant health is stable but could be improved"
        };
    });
}
/**
 * Generate a crop credit report based on analysis data
 * @param analyses Array of analysis results
 * @returns Crop credit report data
 */
function generateCropCreditReport(analyses) {
    return __awaiter(this, void 0, void 0, function* () {
        // Calculate average health score
        const avgHealthScore = analyses.reduce((sum, analysis) => sum + analysis.healthScore, 0) / analyses.length;
        // Predict yield based on health scores
        const yieldQuality = avgHealthScore > 80 ? "Premium" : avgHealthScore > 60 ? "Good" : "Standard";
        const yieldMultiplier = avgHealthScore / 100;
        // Calculate sustainability score
        const sustainabilityScore = Math.min(100, Math.floor(avgHealthScore * 0.8 + 20));
        // Combine all recommendations
        const allRecommendations = analyses.flatMap(analysis => analysis.recommendations);
        const uniqueRecommendations = [...new Set(allRecommendations)];
        return {
            healthScore: Math.floor(avgHealthScore),
            predictedYield: {
                min: Math.floor(1000 * yieldMultiplier * 0.8),
                max: Math.floor(1000 * yieldMultiplier * 1.2),
                quality: yieldQuality
            },
            sustainabilityScore,
            recommendations: uniqueRecommendations.slice(0, 5) // Top 5 recommendations
        };
    });
}
exports.default = {
    analyzePlantHealth,
    comparePlantGrowth,
    generateCropCreditReport
};
