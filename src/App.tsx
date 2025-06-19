import { useState, useEffect, useRef } from "react";
import { pinyin } from "pinyin-pro";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  LinearProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useMediaQuery,
} from "@mui/material";
import {
  Mic,
  MicOff,
  Clear,
  Language,
  RecordVoiceOver,
  CheckCircle,
  Schedule,
  Settings,
  Info,
} from "@mui/icons-material";

interface TranscriptionEntry {
  id: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
}

// Create a modern admin theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
      light: "#ff5983",
      dark: "#9a0036",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a2027",
      secondary: "#637381",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>(
    []
  );
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [language, setLanguage] = useState("zh-CN");
  const [showSettings, setShowSettings] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Add pinyin to Chinese characters with proper tone marks
  const addPinyinToChinese = (text: string): string => {
    const chineseRegex = /[\u4e00-\u9fff]+/g;

    return text.replace(chineseRegex, (match) => {
      const pinyinResult = pinyin(match, { toneType: "symbol", type: "array" });
      return `${match}（${pinyinResult.join(" ")}）`;
    });
  };

  // Initialize speech recognition
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsRecording(true);
      console.log("Speech recognition started with language:", language);
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log("Speech recognition ended");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        const processedText = addPinyinToChinese(finalTranscript);
        const newEntry: TranscriptionEntry = {
          id: Date.now().toString(),
          text: processedText,
          timestamp: new Date(),
          isFinal: true,
        };
        setTranscriptions((prev) => [...prev, newEntry]);
        setCurrentTranscript("");
      } else {
        setCurrentTranscript(addPinyinToChinese(interimTranscript));
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const clearTranscriptions = () => {
    setTranscriptions([]);
    setCurrentTranscript("");
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString();
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      }, 100);
    }
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case "zh-CN":
        return "Chinese";
      case "en-US":
        return "English";
      case "zh-CN,en-US":
        return "Both";
      default:
        return lang;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              <RecordVoiceOver />
            </Avatar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: "text.primary",
                fontSize: { xs: 18, sm: 22 },
              }}
            >
              Live Transcribe
            </Typography>
            <IconButton onClick={() => setShowSettings(true)}>
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
          <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
            <Grid item xs={12} md={10} lg={8}>
              <Card sx={{ mb: isMobile ? 2 : 4, p: { xs: 1, sm: 2, md: 3 } }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: { xs: 1, sm: 3 },
                    }}
                  >
                    <Language sx={{ mr: 1 }} />
                    Recognition Settings
                  </Typography>

                  <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Language Selection
                    </Typography>
                    <ToggleButtonGroup
                      value={language}
                      exclusive
                      onChange={(e, newLanguage) =>
                        newLanguage && handleLanguageChange(newLanguage)
                      }
                      sx={{ mb: 2, flexWrap: "wrap" }}
                    >
                      <ToggleButton value="zh-CN" sx={{ minWidth: 100 }}>
                        中文 (Chinese)
                      </ToggleButton>
                      <ToggleButton value="en-US" sx={{ minWidth: 100 }}>
                        English
                      </ToggleButton>
                      <ToggleButton value="zh-CN,en-US" sx={{ minWidth: 100 }}>
                        Both
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <Divider sx={{ my: { xs: 1, sm: 2 } }} />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Button
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      startIcon={isRecording ? <MicOff /> : <Mic />}
                      onClick={toggleRecording}
                      color={isRecording ? "secondary" : "primary"}
                      sx={{ minWidth: { xs: 120, sm: 200 } }}
                    >
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>

                    <Button
                      variant="outlined"
                      size={isMobile ? "medium" : "large"}
                      startIcon={<Clear />}
                      onClick={clearTranscriptions}
                      sx={{ minWidth: { xs: 100, sm: 150 } }}
                    >
                      Clear All
                    </Button>
                  </Box>

                  {isRecording && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress color="primary" />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Recording in progress...
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Current Transcript */}
              {currentTranscript && (
                <Alert
                  severity="info"
                  sx={{ mb: isMobile ? 2 : 3, fontSize: { xs: 14, sm: 16 } }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, fontSize: { xs: 14, sm: 16 } }}
                  >
                    Listening: {currentTranscript}
                  </Typography>
                </Alert>
              )}

              {/* Transcriptions List */}
              <Card>
                <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: { xs: 16, sm: 20 },
                    }}
                  >
                    <RecordVoiceOver sx={{ mr: 1 }} />
                    Transcriptions
                  </Typography>

                  {transcriptions.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: { xs: 4, sm: 8 } }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: "grey.200",
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <Mic sx={{ fontSize: 32, color: "grey.500" }} />
                      </Avatar>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontSize: { xs: 16, sm: 20 } }}
                      >
                        Ready to Transcribe
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: 13, sm: 15 } }}
                      >
                        Click "Start Recording" to begin transcribing
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {[...transcriptions].reverse().map((entry, index) => (
                        <Box key={entry.id}>
                          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  bgcolor: "success.main",
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                <CheckCircle fontSize="small" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: { xs: 14, sm: 16 },
                                  }}
                                >
                                  {entry.text}
                                </Typography>
                              }
                              secondary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 1,
                                  }}
                                >
                                  <Schedule
                                    sx={{
                                      fontSize: 16,
                                      mr: 0.5,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: 11, sm: 13 } }}
                                  >
                                    {formatTime(entry.timestamp)}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < transcriptions.length - 1 && (
                            <Divider variant="inset" component="li" />
                          )}
                        </Box>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Settings Dialog */}
        <Dialog
          open={showSettings}
          onClose={() => setShowSettings(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure your speech recognition preferences and language
              settings.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current language: <strong>{getLanguageLabel(language)}</strong>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSettings(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="record"
          onClick={toggleRecording}
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            bgcolor: isRecording ? "secondary.main" : "primary.main",
            zIndex: 1201,
          }}
        >
          {isRecording ? <MicOff /> : <Mic />}
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

export default App;
