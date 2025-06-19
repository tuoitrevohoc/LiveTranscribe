import { useState, useEffect, useRef } from "react";
import { pinyin } from "pinyin-pro";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
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
    body1: { fontSize: 14 },
    body2: { fontSize: 13 },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          borderRadius: 4,
          padding: 0,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 4,
          boxShadow: "none",
          padding: "4px 12px",
          minWidth: 0,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: "4px 10px",
          fontSize: 13,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
          "&:last-child": { paddingBottom: "12px" },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {
          minWidth: 36,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 28,
          height: 28,
          fontSize: 16,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "4px 0",
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

  // Add pinyin to Chinese characters (now just returns the original text, no parentheses)
  const addPinyinToChinese = (text: string): string => {
    return text;
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

  // Helper to render transcription with pinyin above Chinese characters using <ruby>
  const renderTranscriptionText = (text: string) => {
    const chineseRegex = /([\u4e00-\u9fff]+)/g;
    const parts = text.split(chineseRegex);
    return (
      <span style={{ fontSize: "2.2rem", lineHeight: 1.7 }}>
        {parts.map((part, idx) => {
          if (chineseRegex.test(part)) {
            return (
              <span className="chinese-font" key={idx}>
                {Array.from(part).map((char, i) => {
                  const py =
                    pinyin(char, {
                      toneType: "symbol",
                      type: "array",
                      pattern: "pinyin",
                    })[0] || "";
                  return (
                    <ruby key={i} style={{ margin: "0 2px" }}>
                      {char}
                      <rt>{py}</rt>
                    </ruby>
                  );
                })}
              </span>
            );
          } else {
            return <span key={idx}>{part}</span>;
          }
        })}
      </span>
    );
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
          <Toolbar sx={{ minHeight: 48 }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
              <RecordVoiceOver fontSize="small" />
            </Avatar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: "text.primary",
                fontSize: { xs: 16, sm: 18 },
              }}
            >
              Live Transcribe
            </Typography>
            <IconButton onClick={() => setShowSettings(true)} size="small">
              <Settings fontSize="small" />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: { xs: 1, sm: 2 } }}>
          <Box sx={{ maxWidth: { md: "90%", lg: "70%" }, mx: "auto" }}>
            <Card sx={{ mb: isMobile ? 1 : 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: { xs: 0.5, sm: 1 },
                  }}
                >
                  <Language sx={{ mr: 1, fontSize: 18 }} />
                  Recognition Settings
                </Typography>

                <Box sx={{ mb: { xs: 1, sm: 2 } }}>
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
                    onChange={(_, newLanguage) =>
                      newLanguage && handleLanguageChange(newLanguage)
                    }
                    sx={{ mb: 1, flexWrap: "wrap" }}
                  >
                    <ToggleButton value="zh-CN">中文 (Chinese)</ToggleButton>
                    <ToggleButton value="en-US">English</ToggleButton>
                    <ToggleButton value="zh-CN,en-US">Both</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Divider sx={{ my: { xs: 0.5, sm: 1 } }} />

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button
                    startIcon={
                      isRecording ? (
                        <MicOff fontSize="small" />
                      ) : (
                        <Mic fontSize="small" />
                      )
                    }
                    onClick={toggleRecording}
                    color={isRecording ? "secondary" : "primary"}
                  >
                    {isRecording ? "Stop" : "Start"}
                  </Button>

                  <Button
                    startIcon={<Clear fontSize="small" />}
                    onClick={clearTranscriptions}
                  >
                    Clear
                  </Button>
                </Box>

                {isRecording && (
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      color="primary"
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: "block",
                        fontSize: 11,
                      }}
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
                sx={{
                  mb: isMobile ? 1 : 2,
                  fontSize: { xs: 13, sm: 14 },
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, fontSize: { xs: 13, sm: 14 } }}
                >
                  Listening: {currentTranscript}
                </Typography>
              </Alert>
            )}

            {/* Transcriptions List */}
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: 14, sm: 16 },
                  }}
                >
                  <RecordVoiceOver sx={{ mr: 1, fontSize: 18 }} />
                  Transcriptions
                </Typography>

                {transcriptions.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: { xs: 2, sm: 4 },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "grey.200",
                        mx: "auto",
                        mb: 1,
                      }}
                    >
                      <Mic sx={{ fontSize: 18, color: "grey.500" }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontSize: { xs: 13, sm: 15 } }}
                    >
                      Ready to Transcribe
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: 11, sm: 13 } }}
                    >
                      Click "Start" to begin transcribing
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {[...transcriptions].reverse().map((entry, index) => (
                      <Box key={entry.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "success.main" }}>
                              <CheckCircle fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  fontWeight: 500,
                                  fontSize: { xs: 18, sm: 22 },
                                  lineHeight: 1.7,
                                }}
                              >
                                {renderTranscriptionText(entry.text)}
                              </Box>
                            }
                            secondary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 0.5,
                                }}
                              >
                                <Schedule
                                  sx={{
                                    fontSize: 13,
                                    mr: 0.5,
                                    color: "text.secondary",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: { xs: 10, sm: 12 } }}
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
          </Box>
        </Container>

        {/* Settings Dialog */}
        <Dialog
          open={showSettings}
          onClose={() => setShowSettings(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontSize: 16, fontWeight: 500, p: 1.5 }}>
            Settings
          </DialogTitle>
          <DialogContent sx={{ p: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              sx={{ fontSize: 13 }}
            >
              Configure your speech recognition preferences and language
              settings.
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: 13 }}
            >
              Current language: <strong>{language}</strong>
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 1.5 }}>
            <Button onClick={() => setShowSettings(false)} size="small">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="record"
          onClick={toggleRecording}
          size="small"
          sx={{
            position: "fixed",
            bottom: { xs: 12, sm: 16 },
            right: { xs: 12, sm: 16 },
            bgcolor: isRecording ? "secondary.main" : "primary.main",
            zIndex: 1201,
            boxShadow: "none",
            borderRadius: 2,
          }}
        >
          {isRecording ? <MicOff fontSize="small" /> : <Mic fontSize="small" />}
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

export default App;
