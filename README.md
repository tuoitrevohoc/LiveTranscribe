# Live Transcribe

A professional real-time speech transcription web application built with React, TypeScript, and Material UI. The app uses the browser's Speech Recognition API to transcribe speech and automatically adds pinyin to Chinese characters.

## 🌟 Features

- 🎤 **Real-time Speech Recognition**: Uses the browser's built-in Speech Recognition API
- 🌏 **Multi-language Support**: Supports both English and Chinese speech
- 📝 **Automatic Pinyin**: Automatically detects Chinese characters and adds pinyin with tone marks
- 💬 **Conversation Display**: Shows transcribed text in a conversation-like format with timestamps
- 🎨 **Modern UI**: Professional Material UI design with admin panel aesthetics
- ⚡ **Live Preview**: Shows interim results while speaking

## 🚀 Live Demo

Visit the live application: **[Live Transcribe](https://tuoitrevohoc.github.io/LiveTranscribe)**

## 📱 Example

When you say: _"I want to say 你可以帮我吗？"_

The app displays: _"I want to say 你可以帮我吗（nǐ kě yǐ bāng wǒ ma）?"_

## 🛠️ Technologies Used

- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Material UI**: Professional component library
- **Vite**: Fast build tool and dev server
- **pinyin-pro**: Chinese pinyin conversion library

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- A modern browser that supports Speech Recognition API (Chrome, Edge, Safari)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/banhtieu/LiveTranscribe.git
cd LiveTranscribe
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5174`

### Usage

1. **Select Language**: Choose between Chinese, English, or Both
2. **Start Recording**: Click "Start Recording" to begin speech recognition
3. **Speak**: Talk naturally - the app will transcribe your speech in real-time
4. **View Results**: Transcribed text appears with automatic pinyin for Chinese
5. **Stop Recording**: Click "Stop Recording" to end the session
6. **Clear All**: Use "Clear All" to reset the conversation

## 🌐 Browser Compatibility

The Speech Recognition API is supported in:

- ✅ Chrome (desktop and mobile)
- ✅ Edge (Chromium-based)
- ✅ Safari (iOS 14.5+)
- ❌ Firefox (not supported)

## 📦 Deployment

### GitHub Pages (Automatic)

The app is automatically deployed to GitHub Pages via GitHub Actions:

1. **Push to main branch**: Any push to the main branch triggers automatic deployment
2. **GitHub Actions**: Builds and deploys the app to `https://banhtieu.github.io/LiveTranscribe`
3. **Live Updates**: Changes are live within minutes of pushing

### Manual Deployment

To deploy manually:

```bash
npm run build
npm run deploy
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

### Project Structure

```
LiveTranscribe/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles
│   └── types/
│       └── speech-recognition.d.ts  # TypeScript definitions
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions deployment
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

## 🎯 Key Features

### Speech Recognition

- **Continuous Recognition**: Keeps listening until manually stopped
- **Interim Results**: Shows partial transcriptions in real-time
- **Multi-language**: Supports English and Chinese simultaneously
- **Error Handling**: Graceful handling of recognition errors

### Pinyin Conversion

- **Automatic Detection**: Identifies Chinese characters using regex
- **Tone Marks**: Uses proper diacritics (ā, á, ǎ, à) instead of numbers
- **Real-time Processing**: Converts text as it's transcribed

### Modern UI

- **Material Design**: Professional admin panel interface
- **Responsive Layout**: Works on desktop and mobile
- **Dark Mode Ready**: Built with Material UI theming
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Browser Speech Recognition API
- pinyin-pro library for Chinese pinyin conversion
- Material UI for the component library
- Vite for the fast development experience
