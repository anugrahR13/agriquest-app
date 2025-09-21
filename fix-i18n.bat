@echo off
cd /d "c:\Users\venum\agriquest app\agriquest-app"
npm cache clean --force
npm install i18next i18next-browser-languagedetector
npm install react-is
npm run dev