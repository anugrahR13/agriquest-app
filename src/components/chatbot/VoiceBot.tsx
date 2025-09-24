'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Volume2, VolumeX, Send, Languages, HelpCircle, Calendar, Sprout, Bug, Sun, CloudRain, Thermometer, Droplets, Wind, MapPin, Camera, FileText, Settings, User, Leaf, Shield, Zap, BarChart3 } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function VoiceBot() {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);
  const [supportedLanguages] = useState([
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'kn', name: 'Kannada' },
    { code: 'gu', name: 'Gujarati' }
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [activeFeature, setActiveFeature] = useState('general'); // general, weather, crop, pest, schedule, soil, irrigation, market
  const [isMuted, setIsMuted] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string, lang: string) => {
    if (synthRef.current && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = voiceSpeed;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Add user message to conversation
    const userMessage = { role: 'user', content: userInput };
    setConversation(prev => [...prev, userMessage]);
    
    try {
      // In a real implementation, this would call our backend API
      // For demo, we'll simulate a response
      const responseText = getSimulatedResponse(userInput, selectedLanguage, activeFeature);
      
      // Add bot response to conversation
      const botMessage = { role: 'bot', content: responseText };
      setConversation(prev => [...prev, botMessage]);
      
      // Speak the response
      speakText(responseText, selectedLanguage);
      
      // Clear input
      setUserInput('');
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorMessage = { role: 'bot', content: t('voice_bot_error') };
      setConversation(prev => [...prev, errorMessage]);
    }
  };

  const getSimulatedResponse = (input: string, lang: string, feature: string): string => {
    // This is a simple simulation - in a real app, this would call an AI service
    const responses: Record<string, Record<string, Record<string, string>>> = {
      en: {
        general: {
          'hello': 'Hello! I\'m your farming assistant. How can I help you today?',
          'help': 'I can help you with crop management, pest control, weather updates, and farming schedules. What would you like to know?',
          'default': 'I understand you\'re asking about farming. Could you please be more specific about what you need help with?'
        },
        weather: {
          'weather': 'Today\'s weather is sunny with a high of 32°C. Perfect conditions for most crops. Remember to water your plants if there\'s no rain expected.',
          'rain': 'There\'s a 60% chance of rain tomorrow. It\'s a good time for planting if you\'re planning to sow seeds.',
          'temperature': 'The current temperature is 28°C. This is ideal for growing vegetables like tomatoes and peppers.',
          'humidity': 'The current humidity is 65%. This is suitable for most crops, but monitor for fungal diseases in high humidity conditions.',
          'forecast': 'The 3-day forecast shows sunny weather with temperatures between 26-34°C. Good conditions for crop growth.',
          'default': 'For weather information, I recommend checking your local weather service for the most accurate updates.'
        },
        crop: {
          'crop': 'I can help you with crop management. Which crop are you growing?',
          'wheat': 'For wheat cultivation, ensure proper soil preparation, adequate spacing, and regular watering. Apply nitrogen-rich fertilizer during the growing season.',
          'rice': 'Rice requires flooded fields. Maintain 5-10cm water depth and apply phosphorus and potassium fertilizers at appropriate growth stages.',
          'vegetables': 'For vegetable gardening, ensure proper spacing, regular watering, and pest control. Harvest when vegetables reach maturity.',
          'fertilizer': 'Apply balanced fertilizers based on soil test results. Organic options include compost, manure, and bone meal.',
          'default': 'I can provide specific advice for wheat, rice, and vegetables. What crop are you interested in?'
        },
        pest: {
          'pest': 'I can help with pest control. What pest are you dealing with?',
          'aphids': 'For aphid control, spray neem oil or insecticidal soap. Introduce ladybugs as a natural predator.',
          'locusts': 'For locust control, use biopesticides like Metarhizium acridum. Contact your local agricultural department for coordinated control measures.',
          'worms': 'For worm control, apply neem cake to soil. Use pheromone traps for specific worm species.',
          'mites': 'For mite control, increase humidity around plants and spray with insecticidal soap or neem oil.',
          'default': 'I can help with aphids, locusts, worms, and mites. What pest problem are you facing?'
        },
        schedule: {
          'schedule': 'I can help with farming schedules. What activity are you planning?',
          'planting': 'The best time for planting is during the early morning or late afternoon to avoid heat stress.',
          'harvesting': 'Harvest crops when they reach physiological maturity. Check specific crop guidelines for optimal timing.',
          'fertilizing': 'Apply fertilizers during active growth periods. Organic fertilizers can be applied every 4-6 weeks.',
          'spraying': 'The best time for pesticide spraying is early morning or late evening when winds are calm.',
          'default': 'I can help with planting, harvesting, fertilizing, and spraying schedules. What activity do you need help with?'
        },
        soil: {
          'soil': 'I can help with soil management. What soil issue are you experiencing?',
          'ph': 'Most crops prefer a soil pH between 6.0-7.0. Test your soil and adjust with lime (to raise pH) or sulfur (to lower pH).',
          'moisture': 'Optimal soil moisture varies by crop. Use a moisture meter to monitor and irrigate when levels drop below 60%.',
          'fertility': 'Improve soil fertility with organic matter like compost, manure, or cover crops. Rotate crops to maintain nutrients.',
          'drainage': 'Ensure proper drainage to prevent waterlogging. Add organic matter and create raised beds for better drainage.',
          'default': 'I can help with soil pH, moisture, fertility, and drainage. What soil concern do you have?'
        },
        irrigation: {
          'irrigation': 'I can help with irrigation practices. What irrigation method are you using?',
          'drip': 'Drip irrigation is highly efficient, delivering water directly to plant roots. Check for clogs and maintain proper pressure.',
          'sprinkler': 'Sprinkler systems are good for large areas. Water early morning to reduce evaporation and disease risk.',
          'flood': 'Flood irrigation works well for rice. Monitor water levels to prevent overwatering and nutrient leaching.',
          'frequency': 'Watering frequency depends on crop type, soil, and weather. Check soil moisture before irrigating.',
          'default': 'I can help with drip, sprinkler, and flood irrigation methods. What irrigation question do you have?'
        },
        market: {
          'market': 'I can provide market information. What crop prices are you interested in?',
          'prices': 'Check local mandis for current prices. Prices fluctuate based on supply, demand, and season.',
          'selling': 'Harvest at optimal maturity for best prices. Grade and package produce properly for higher value.',
          'buying': 'Buy seeds and inputs during off-season for better prices. Compare prices from multiple suppliers.',
          'storage': 'Store grains in moisture-proof containers. Use proper ventilation and pest control for storage.',
          'default': 'I can help with market prices, selling, buying, and storage. What market information do you need?'
        }
      },
      hi: {
        general: {
          'hello': 'नमस्ते! मैं आपका कृषि सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
          'help': 'मैं फसल प्रबंधन, कीट नियंत्रण, मौसम अद्यतन और कृषि अनुसूचियों में आपकी मदत कर सकता हूँ। आप क्या जानना चाहेंगे?',
          'default': 'मैं समझता हूँ कि आप खेती के बारे में पूछ रहे हैं। क्या आप कृपया यह बता सकते हैं कि आपको किस बारे में मदद की आवश्यकता है?'
        },
        weather: {
          'weather': 'आज का मौसम धूप वाला है जिसमें अधिकतम 32°C है। ज्यादातर फसलों के लिए यह एकदम सही हालात हैं। अगर बारिश की उम्मीद नहीं है तो अपने पौधों को पानी देना न भूलें।',
          'rain': 'कल बारिश की 60% संभावना है। अगर आप बीज बोने की योजना बना रहे हैं तो यह बोने का अच्छा समय है।',
          'temperature': 'वर्तमान तापमान 28°C है। यह टमाटर और शिमला मिर्च जैसी सब्जियों के लिए आदर्श है।',
          'humidity': 'वर्तमान आर्द्रता 65% है। यह ज्यादातर फसलों के लिए उपयुक्त है, लेकिन उच्च आर्द्रता की स्थिति में कवक रोगों की निगरानी करें।',
          'forecast': '3-दिन के पूर्वानुमान में सूरज वाला मौसम दिखाया गया है जिसमें तापमान 26-34°C के बीच है। फसल वृद्धि के लिए अच्छी स्थिति है।',
          'default': 'मौसम की जानकारी के लिए, मैं आपको सबसे सटीक अपडेट के लिए अपनी स्थानीय मौसम सेवा की जाँच करने की सलाह देता हूँ।'
        },
        crop: {
          'crop': 'मैं फसल प्रबंधन में आपकी मदद कर सकता हूँ। आप कौन सी फसल उगा रहे हैं?',
          'wheat': 'गेहूं की खेती के लिए, मिट्टी की उचित तैयारी, पर्याप्त अंतर और नियमित सिंचाई सुनिश्चित करें। वृद्धि के मौसम के दौरान नाइट्रोजन-समृद्ध उर्वरक लगाएं।',
          'rice': 'चावल के लिए जलमग्न खेतों की आवश्यकता होती है। 5-10cm जल गहराई बनाए रखें और उचित वृद्धि अवस्थाओं में फॉस्फोरस और पोटेशियम उर्वरक लगाएं।',
          'vegetables': 'सब्जी बगीचे के लिए, उचित अंतर, नियमित सिंचाई और कीट नियंत्रण सुनिश्चित करें। जब सब्जियां पक जाएं तो काटें।',
          'fertilizer': 'मिट्टी परीक्षण परिणामों के आधार पर संतुलित उर्वरक लगाएं। जैविक विकल्पों में कंपोस्ट, गोबर और हड्डी का चूर्ण शामिल हैं।',
          'default': 'मैं गेहूं, चावल और सब्जियों के लिए विशिष्ट सलाह प्रदान कर सकता हूँ। आप किस फसल में रुचि रखते हैं?'
        },
        pest: {
          'pest': 'मैं कीट नियंत्रण में आपकी मदद कर सकता हूँ। आप किस कीट से निपट रहे हैं?',
          'aphids': 'एफिड्स के नियंत्रण के लिए, नीम तेल या कीटनाशक साबुन का छिड़काव करें। प्राकृतिक शिकारी के रूप में एंटलायन का परिचय दें।',
          'locusts': 'टिड्डियों के नियंत्रण के लिए, Metarhizium acridum जैसे जैव कीटनाशकों का उपयोग करें। समन्वित नियंत्रण उपायों के लिए अपने स्थानीय कृषि विभाग से संपर्क करें।',
          'worms': 'केंचुओं के नियंत्रण के लिए, मिट्टी में नीम केक लगाएं। विशिष्ट केंचुआ प्रजातियों के लिए फेरोमोन फंदे का उपयोग करें।',
          'mites': 'माइट्स के नियंत्रण के लिए, पौधों के चारों ओर आर्द्रता बढ़ाएं और कीटनाशक साबुन या नीम तेल के साथ छिड़काव करें।',
          'default': 'मैं एफिड्स, टिड्डियों, केंचुओं और माइट्स में मदद कर सकता हूँ। आप किस कीट समस्या का सामना कर रहे हैं?'
        },
        schedule: {
          'schedule': 'मैं कृषि अनुसूचियों में आपकी मदद कर सकता हूँ। आप कौन सी गतिविधि की योजना बना रहे हैं?',
          'planting': 'बोने का सबसे अच्छा समय सुबह के जल्दी या शाम के बाद का है ताकि गर्मी का तनाव न रहे।',
          'harvesting': 'फसलों को काटें जब वे शारीरिक परिपक्वता तक पहुंच जाएं। इष्टतम समय के लिए विशिष्ट फसल दिशानिर्देश देखें।',
          'fertilizing': 'सक्रिय वृद्धि अवधि के दौरान उर्वरक लगाएं। 4-6 हफ्तों में एक बार जैविक उर्वरक लगाए जा सकते हैं।',
          'spraying': 'कीटनाशक छिड़काव का सबसे अच्छा समय सुबह के जल्दी या शाम के बाद का है जब हवाएं शांत होती हैं।',
          'default': 'मैं बोने, काटने, उर्वरक और छिड़काव अनुसूचियों में मदद कर सकता हूँ। आपको किस गतिविधि में मदद की आवश्यकता है?'
        },
        soil: {
          'soil': 'मैं मिट्टी प्रबंधन में आपकी मदद कर सकता हूँ। आप किस मिट्टी की समस्या का अनुभव कर रहे हैं?',
          'ph': 'ज्यादातर फसलों को 6.0-7.0 के बीच मिट्टी का पीएच पसंद है। अपनी मिट्टी का परीक्षण करें और चूना (पीएच बढ़ाने के लिए) या सल्फर (पीएच कम करने के लिए) के साथ समायोजित करें।',
          'moisture': 'इष्टतम मिट्टी की नमी फसल के अनुसार अलग-अलग होती है। निगरानी करने और 60% से नीचे आने पर सिंचाई करने के लिए एक नमी मीटर का उपयोग करें।',
          'fertility': 'कंपोस्ट, गोबर या कवर फसलों जैसे जैविक पदार्थ के साथ मिट्टी की उर्वरता में सुधार करें। पोषक तत्वों को बनाए रखने के लिए फसलों को घुमाएं।',
          'drainage': 'जलभराव को रोकने के लिए उचित निकासी सुनिश्चित करें। बेहतर निकासी के लिए जैविक पदार्थ जोड़ें और उठाए गए बिस्तर बनाएं।',
          'default': 'मैं मिट्टी के पीएच, नमी, उर्वरता और निकासी में मदद कर सकता हूँ। आपके पास कौन सी मिट्टी की चिंता है?'
        },
        irrigation: {
          'irrigation': 'मैं सिंचाई प्रथाओं में आपकी मदद कर सकता हूँ। आप किस सिंचाई विधि का उपयोग कर रहे हैं?',
          'drip': 'ड्रिप सिंचाई अत्यधिक कुशल है, जो पानी को सीधे पौधे की जड़ों तक पहुंचाती है। ब्लॉकिंग की जांच करें और उचित दबाव बनाए रखें।',
          'sprinkler': 'स्प्रिंकलर सिस्टम बड़े क्षेत्रों के लिए अच्छा है। वाष्पीकरण और रोग जोखिम को कम करने के लिए सुबह के समय पानी दें।',
          'flood': 'फ्लड सिंचाई चावल के लिए अच्छी तरह से काम करती है। अतिरिक्त पानी और पोषक तत्वों के निकास को रोकने के लिए जल स्तर की निगरानी करें।',
          'frequency': 'सिंचाई की आवृत्ति फसल प्रकार, मिट्टी और मौसम पर निर्भर करती है। सिंचाई से पहले मिट्टी की नमी की जांच करें।',
          'default': 'मैं ड्रिप, स्प्रिंकलर और फ्लड सिंचाई विधियों में मदद कर सकता हूँ। आपके पास कौन सा सिंचाई प्रश्न है?'
        },
        market: {
          'market': 'मैं बाजार की जानकारी प्रदान कर सकता हूँ। आप किस फसल की कीमतों में रुचि रखते हैं?',
          'prices': 'वर्तमान कीमतों के लिए स्थानीय मंडियों की जांच करें। कीमतें आपूर्ति, मांग और मौसम के आधार पर उतार-चढ़ाव करती हैं।',
          'selling': 'सर्वोत्तम कीमतों के लिए परिपक्वता पर काटें। उच्च मूल्य के लिए उत्पाद को ठीक से ग्रेड और पैक करें।',
          'buying': 'बेहतर कीमतों के लिए ऑफ-सीजन में बीज और इनपुट खरीदें। कई आपूर्तिकर्ताओं से कीमतों की तुलना करें।',
          'storage': 'अनाज को नमी-प्रूफ कंटेनरों में संग्रहीत करें। भंडारण के लिए उचित संवातन और कीट नियंत्रण का उपयोग करें।',
          'default': 'मैं बाजार की कीमतों, बिक्री, खरीदारी और भंडारण में मदद कर सकता हूँ। आपको कौन सी बाजार जानकारी की आवश्यकता है?'
        }
      }
    };
    
    const langResponses = responses[lang] || responses['en'];
    const featureResponses = langResponses[feature] || langResponses['general'];
    
    // Simple keyword matching for demo
    const lowerInput = input.toLowerCase();
    
    // General keywords
    if (lowerInput.includes('hello') || lowerInput.includes('namaste') || lowerInput.includes('namaskar')) {
      return featureResponses['hello'] || langResponses['general']['hello'];
    } else if (lowerInput.includes('help') || lowerInput.includes('madad') || lowerInput.includes('sahayata')) {
      return featureResponses['help'] || langResponses['general']['help'];
    }
    // Weather keywords
    else if (feature === 'weather' || lowerInput.includes('weather') || lowerInput.includes('mausam') || lowerInput.includes('hava')) {
      if (lowerInput.includes('rain') || lowerInput.includes('baarish')) {
        return featureResponses['rain'] || langResponses['weather']['rain'];
      } else if (lowerInput.includes('temperature') || lowerInput.includes('tapman')) {
        return featureResponses['temperature'] || langResponses['weather']['temperature'];
      } else if (lowerInput.includes('humidity') || lowerInput.includes('aaradta')) {
        return featureResponses['humidity'] || langResponses['weather']['humidity'];
      } else if (lowerInput.includes('forecast') || lowerInput.includes('purnanumati')) {
        return featureResponses['forecast'] || langResponses['weather']['forecast'];
      } else {
        return featureResponses['weather'] || langResponses['weather']['weather'];
      }
    }
    // Crop keywords
    else if (feature === 'crop' || lowerInput.includes('crop') || lowerInput.includes('fasal') || lowerInput.includes('pik')) {
      if (lowerInput.includes('wheat') || lowerInput.includes('gehun')) {
        return featureResponses['wheat'] || langResponses['crop']['wheat'];
      } else if (lowerInput.includes('rice') || lowerInput.includes('chawal')) {
        return featureResponses['rice'] || langResponses['crop']['rice'];
      } else if (lowerInput.includes('vegetable') || lowerInput.includes('sabzi')) {
        return featureResponses['vegetables'] || langResponses['crop']['vegetables'];
      } else if (lowerInput.includes('fertilizer') || lowerInput.includes('urvarak')) {
        return featureResponses['fertilizer'] || langResponses['crop']['fertilizer'];
      } else {
        return featureResponses['crop'] || langResponses['crop']['crop'];
      }
    }
    // Pest keywords
    else if (feature === 'pest' || lowerInput.includes('pest') || lowerInput.includes('kide') || lowerInput.includes('kitanashak')) {
      if (lowerInput.includes('aphid') || lowerInput.includes('aphids')) {
        return featureResponses['aphids'] || langResponses['pest']['aphids'];
      } else if (lowerInput.includes('locust') || lowerInput.includes('tiddu')) {
        return featureResponses['locusts'] || langResponses['pest']['locusts'];
      } else if (lowerInput.includes('worm') || lowerInput.includes('kenda')) {
        return featureResponses['worms'] || langResponses['pest']['worms'];
      } else if (lowerInput.includes('mite') || lowerInput.includes('mites')) {
        return featureResponses['mites'] || langResponses['pest']['mites'];
      } else {
        return featureResponses['pest'] || langResponses['pest']['pest'];
      }
    }
    // Schedule keywords
    else if (feature === 'schedule' || lowerInput.includes('schedule') || lowerInput.includes('anushuchi') || lowerInput.includes('time')) {
      if (lowerInput.includes('plant') || lowerInput.includes('ropan') || lowerInput.includes('bo')) {
        return featureResponses['planting'] || langResponses['schedule']['planting'];
      } else if (lowerInput.includes('harvest') || lowerInput.includes('katai')) {
        return featureResponses['harvesting'] || langResponses['schedule']['harvesting'];
      } else if (lowerInput.includes('fertilize') || lowerInput.includes('urvarak')) {
        return featureResponses['fertilizing'] || langResponses['schedule']['fertilizing'];
      } else if (lowerInput.includes('spray') || lowerInput.includes('chhidkav')) {
        return featureResponses['spraying'] || langResponses['schedule']['spraying'];
      } else {
        return featureResponses['schedule'] || langResponses['schedule']['schedule'];
      }
    }
    // Soil keywords
    else if (feature === 'soil' || lowerInput.includes('soil') || lowerInput.includes('mitti')) {
      if (lowerInput.includes('ph') || lowerInput.includes('peh')) {
        return featureResponses['ph'] || langResponses['soil']['ph'];
      } else if (lowerInput.includes('moisture') || lowerInput.includes('nami')) {
        return featureResponses['moisture'] || langResponses['soil']['moisture'];
      } else if (lowerInput.includes('fertility') || lowerInput.includes('urvarata')) {
        return featureResponses['fertility'] || langResponses['soil']['fertility'];
      } else if (lowerInput.includes('drainage') || lowerInput.includes('nali')) {
        return featureResponses['drainage'] || langResponses['soil']['drainage'];
      } else {
        return featureResponses['soil'] || langResponses['soil']['soil'];
      }
    }
    // Irrigation keywords
    else if (feature === 'irrigation' || lowerInput.includes('irrigation') || lowerInput.includes('sichai')) {
      if (lowerInput.includes('drip') || lowerInput.includes('drip')) {
        return featureResponses['drip'] || langResponses['irrigation']['drip'];
      } else if (lowerInput.includes('sprinkler') || lowerInput.includes('fuhar')) {
        return featureResponses['sprinkler'] || langResponses['irrigation']['sprinkler'];
      } else if (lowerInput.includes('flood') || lowerInput.includes('baadh')) {
        return featureResponses['flood'] || langResponses['irrigation']['flood'];
      } else if (lowerInput.includes('frequency') || lowerInput.includes('avritti')) {
        return featureResponses['frequency'] || langResponses['irrigation']['frequency'];
      } else {
        return featureResponses['irrigation'] || langResponses['irrigation']['irrigation'];
      }
    }
    // Market keywords
    else if (feature === 'market' || lowerInput.includes('market') || lowerInput.includes('bazar')) {
      if (lowerInput.includes('price') || lowerInput.includes('dam')) {
        return featureResponses['prices'] || langResponses['market']['prices'];
      } else if (lowerInput.includes('sell') || lowerInput.includes('bechana')) {
        return featureResponses['selling'] || langResponses['market']['selling'];
      } else if (lowerInput.includes('buy') || lowerInput.includes('kharidna')) {
        return featureResponses['buying'] || langResponses['market']['buying'];
      } else if (lowerInput.includes('storage') || lowerInput.includes('bhandaar')) {
        return featureResponses['storage'] || langResponses['market']['storage'];
      } else {
        return featureResponses['market'] || langResponses['market']['market'];
      }
    } else {
      return featureResponses['default'] || langResponses['general']['default'];
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const setFeature = (feature: string) => {
    setActiveFeature(feature);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const handleVoiceSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVoiceSpeed(parseFloat(e.target.value));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('voice_assistant')}</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Languages className="inline h-4 w-4 mr-1" />
          {t('select_language')}
        </label>
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Feature Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <HelpCircle className="inline h-4 w-4 mr-1" />
          {t('select_feature')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setFeature('general')}
            className={`p-2 rounded-md text-sm flex flex-col items-center ${
              activeFeature === 'general'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <HelpCircle className="h-4 w-4 mb-1" />
            {t('general')}
          </button>
          <button
            onClick={() => setFeature('weather')}
            className={`p-2 rounded-md text-sm flex flex-col items-center ${
              activeFeature === 'weather'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CloudRain className="h-4 w-4 mb-1" />
            {t('weather')}
          </button>
          <button
            onClick={() => setFeature('crop')}
            className={`p-2 rounded-md text-sm flex flex-col items-center ${
              activeFeature === 'crop'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sprout className="h-4 w-4 mb-1" />
            {t('crop')}
          </button>
          <button
            onClick={() => setFeature('pest')}
            className={`p-2 rounded-md text-sm flex flex-col items-center ${
              activeFeature === 'pest'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bug className="h-4 w-4 mb-1" />
            {t('pest')}
          </button>
          <button
            onClick={() => setFeature('schedule')}
            className={`p-2 rounded-md text-sm flex flex-col items-center ${
              activeFeature === 'schedule'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="h-4 w-4 mb-1" />
            {t('schedule')}
          </button>
          <button
            onClick={() => setFeature('soil')}
            className={`p-2 rounded-md text-sm flex flex-col items-center ${
              activeFeature === 'soil'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Leaf className="h-4 w-4 mb-1" />
            {t('soil')}
          </button>
          <button
            onClick={() => setFeature('irrigation')}
            className={`p-2 rounded-md text-sm flex flex-col items-center ${
              activeFeature === 'irrigation'
                ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Droplets className="h-4 w-4 mb-1" />
            {t('irrigation')}
          </button>
          <button
            onClick={() => setFeature('market')}
            className={`p-2 rounded-md text-sm flex flex-col items-center ${
              activeFeature === 'market'
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4 mb-1" />
            {t('market')}
          </button>
        </div>
      </div>
      
      {/* Voice Settings */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Settings className="inline h-4 w-4 mr-1" />
            {t('voice_settings')}
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-md ${
                isMuted 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <select
              value={voiceSpeed}
              onChange={handleVoiceSpeedChange}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="0.5">0.5x {t('speed')}</option>
              <option value="0.75">0.75x {t('speed')}</option>
              <option value="1">1x {t('speed')}</option>
              <option value="1.25">1.25x {t('speed')}</option>
              <option value="1.5">1.5x {t('speed')}</option>
              <option value="2">2x {t('speed')}</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            {t('voice_preferences')}
          </label>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              title={t('save_conversation')}
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              title={t('clear_conversation')}
              onClick={() => setConversation([])}
            >
              <Zap className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-4 rounded-full ${
              isListening 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </button>
          
          <button
            onClick={() => setIsSpeaking(!isSpeaking)}
            className={`p-4 rounded-full ${
              isSpeaking 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
          </button>
        </div>
        
        <p className="text-center text-sm text-gray-600">
          {isListening 
            ? t('listening') 
            : `${t('click_mic_to_speak')} (${t(activeFeature)})`}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={`${t('type_your_question')} (${t(activeFeature)})`}
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-green-500 focus:border-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-r-md"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
      
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-800">{t('conversation')}</h3>
          <button 
            onClick={() => setConversation([])}
            className="text-sm text-red-600 hover:text-red-800"
          >
            {t('clear_conversation')}
          </button>
        </div>
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {conversation.length === 0 ? (
            <p className="text-gray-500 text-center py-4">{t('no_conversation_yet')}</p>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-green-50 text-green-800 ml-4'
                    : 'bg-blue-50 text-blue-800 mr-4'
                }`}
              >
                <div className="font-medium mb-1">
                  {message.role === 'user' ? t('you') : t('assistant')}
                </div>
                <div>{message.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}