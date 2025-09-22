import express from 'express';
import { processVoiceInput, processTextInput } from '../utils/voiceChat';

const router = express.Router();

/**
 * POST /api/voice-chat
 * Accepts audio or text, uses speech-to-text model for transcription,
 * uses a multilingual LLM to answer, returns text and TTS audio.
 */
router.post('/voice-chat', async (req, res) => {
  try {
    const { audioData, text, language = 'en' } = req.body;
    
    // Validate required fields
    if (!audioData && !text) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['audioData or text'] 
      });
    }
    
    let result;
    
    if (audioData) {
      // Process voice input
      result = await processVoiceInput(audioData, language);
    } else {
      // Process text input
      result = await processTextInput(text, language);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error processing voice chat request:', error);
    res.status(500).json({ 
      error: 'Failed to process voice chat request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;