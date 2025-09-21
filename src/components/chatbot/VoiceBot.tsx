'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Volume2, VolumeX, Send, Languages } from 'lucide-react';

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
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
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
      const responseText = getSimulatedResponse(userInput, selectedLanguage);
      
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

  const getSimulatedResponse = (input: string, lang: string): string => {
    // This is a simple simulation - in a real app, this would call an AI service
    const responses: Record<string, Record<string, string>> = {
      en: {
        'hello': 'Hello! How can I help you with your farming today?',
        'weather': 'For weather information, please check your local weather service. I can help with crop-specific advice.',
        'crop': 'I can help you with crop management, pest control, and harvesting advice. What specific crop are you growing?',
        'pest': 'For pest control, I recommend using organic pesticides and companion planting. Would you like specific advice?',
        'default': 'I understand you\'re asking about farming. Could you please be more specific about what you need help with?'
      },
      hi: {
        'hello': 'नमस्ते! आज मैं आपकी खेती में कैसे मदद कर सकता हूँ?',
        'weather': 'मौसम की जानकारी के लिए कृपया अपनी स्थानीय मौसम सेवा की जाँच करें। मैं फसल-विशिष्ट सलाह दे सकता हूँ।',
        'crop': 'मैं फसल प्रबंधन, कीट नियंत्रण और कटाई सलाह में आपकी मदद कर सकता हूँ। आप कौन सी फसल उगा रहे हैं?',
        'pest': 'कीट नियंत्रण के लिए, मैं जैविक कीटनाशक और सहचर रोपण का उपयोग करने की सलाह देता हूँ। क्या आप विशिष्ट सलाह चाहेंगे?',
        'default': 'मैं समझता हूँ कि आप खेती के बारे में पूछ रहे हैं। क्या आप कृपया यह बता सकते हैं कि आपको किस बारे में मदद की आवश्यकता है?'
      },
      mr: {
        'hello': 'नमस्कार! आज मी तुमच्या शेतीत कसे मदत करू शकतो?',
        'weather': 'हवामानाची माहितीसाठी कृपया तुमच्या स्थानिक हवामान सेवेची तपासणी करा. मी पीक-निर्दिष्ट सल्ला देऊ शकतो.',
        'crop': 'मी पीक व्यवस्थापन, किडे नियंत्रण आणि कापणी सल्ला देण्यात तुमची मदत करू शकतो. तुम्ही कोणती पीक लावत आहात?',
        'pest': 'किडे नियंत्रणासाठी, मी सेंद्रिय किटकनाशक आणि सहकारी लावणी वापरण्याची शिफारस करतो. तुम्हाला तपशीलवार सल्ला हवा आहे का?',
        'default': 'मला समजतं की तुम्ही शेतीबद्दल विचारत आहात. कृपया तुम्हाला कोणत्या बाबतीत मदत हवी आहे हे अधिक निश्चितपणे सांगू शकाल का?'
      }
    };
    
    const langResponses = responses[lang] || responses['en'];
    
    // Simple keyword matching for demo
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('hello') || lowerInput.includes('namaste') || lowerInput.includes('namaskar')) {
      return langResponses['hello'];
    } else if (lowerInput.includes('weather') || lowerInput.includes('hava')) {
      return langResponses['weather'];
    } else if (lowerInput.includes('crop') || lowerInput.includes('fasal') || lowerInput.includes('pik')) {
      return langResponses['crop'];
    } else if (lowerInput.includes('pest') || lowerInput.includes('kide') || lowerInput.includes('kitanashak')) {
      return langResponses['pest'];
    } else {
      return langResponses['default'];
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
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
            : t('click_mic_to_speak')}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={t('type_your_question')}
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
        <h3 className="font-medium text-gray-800 mb-4">{t('conversation')}</h3>
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