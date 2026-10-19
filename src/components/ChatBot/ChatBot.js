import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import axios from 'axios';

export const API_BASE_URL = 'http://192.168.4.87:5000/predict'; // Flask API adresiniz

const ChatBot = () => {
  const [input, setInput] = useState(''); // Kullanıcı girişini tutar
  const [messages, setMessages] = useState([]); // Sohbet geçmişini tutar
  const [options, setOptions] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [dots, setDots] = useState(''); // Dots animation state
  const [dotAnimation, setDotAnimation] = useState(new Animated.Value(0)); // Animated value for dot animation

  useEffect(() => {
    const initialMessage = {
      text: 'İyi Günler Nasıl Yardımcı Olabilirim',
      sender: 'bot',
    };
    setMessages(prevMessages => [...prevMessages, initialMessage]);
  }, []);

  // Thinking animation
  useEffect(() => {
    if (isThinking) {
      const animateDots = () => {
        Animated.sequence([
          Animated.timing(dotAnimation, {
            toValue: 1, // Increase the value to show 1 dot
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 2, // Increase the value to show 2 dots
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 3, // Increase the value to show 3 dots
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 0, // Reset to 0
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => animateDots());
      };
      animateDots();
    } else {
      setDots('');
    }
  }, [isThinking]);

  // Kullanıcı mesajını göndermek için fonksiyon
  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    } // Eğer input boşsa mesaj gönderme

    // Kullanıcı mesajını ekle
    const userMessage = {text: input, sender: 'user'};
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      setIsThinking(true);

      await new Promise(resolve => setTimeout(resolve, 3000));
      // API'ye axios ile istek gönderiyoruz
      const res = await axios.post(
        API_BASE_URL,
        {
          text: input, // Göndermek istediğimiz metni JSON formatında gönderiyoruz
        },
        {
          headers: {
            'Content-Type': 'application/json', // JSON formatı gönderildiğini belirtiyoruz
          },
        },
      );

      const botResponse = res.data.response;

      // Eğer bot yanıtında seçenekler varsa, onları işleyelim
      if (botResponse.includes('\n')) {
        const responseArray = botResponse
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
        setOptions(responseArray);
      } else {
        // Yanıtı doğrudan ekleyelim
        setMessages(prevMessages => [
          ...prevMessages,
          {text: botResponse, sender: 'bot'},
        ]);
      }

      // Girdi kutusunu temizle
      setInput('');
    } catch (error) {
      console.error(
        'Hata:',
        error.response ? error.response.data : error.message,
      );
      setMessages(prevMessages => [
        ...prevMessages,
        {
          text:
            'Bir hata oluştu: ' +
            (error.response ? error.response.data : error.message),
          sender: 'bot',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleOptionSelect = async option => {
    // Seçilen seçeneği bir mesaj olarak ekleyelim
    setMessages(prevMessages => [
      ...prevMessages,
      {text: option, sender: 'user'},
    ]);
    setOptions([]); // Seçenekleri temizle

    try {
      setIsThinking(true);

      await new Promise(resolve => setTimeout(resolve, 3000));

      // API'ye seçilen seçenek ile yeni bir istek gönderelim
      const res = await axios.post(
        API_BASE_URL,
        {
          text: option, // Seçilen seçeneği gönderiyoruz
        },
        {
          headers: {
            'Content-Type': 'application/json', // JSON formatı gönderildiğini belirtiyoruz
          },
        },
      );

      const botResponse = res.data.response;

      // Bot cevabını sohbet geçmişine ekle
      setMessages(prevMessages => [
        ...prevMessages,
        {text: botResponse, sender: 'bot'},
      ]);
    } catch (error) {
      console.error(
        'Hata:',
        error.response ? error.response.data : error.message,
      );
      setMessages(prevMessages => [
        ...prevMessages,
        {
          text:
            'Bir hata oluştu: ' +
            (error.response ? error.response.data : error.message),
          sender: 'bot',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Animation logic to generate dots based on animated value
  const getDots = () => {
    const dotCount = Math.floor(dotAnimation._value);
    return '.'.repeat(dotCount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SelfBot</Text>

      {/* Sohbet balonlarını göstermek için FlatList */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.botMessage,
            ]}>
            <Text
              style={[
                styles.messageText,
                item.sender === 'bot' && styles.botText,
              ]}>
              {item.text}
            </Text>
          </View>
        )}
        style={styles.messagesList}
        inverted={false} // Mesajları sıralamayı değiştirdik, en yeni mesaj en altta
      />

      {/* Düşünme animasyonunu göster */}
      {isThinking && (
        <View style={styles.thinkingContainer}>
          <Animated.Text style={styles.thinkingText}>
            {'Thinking' + getDots()}
          </Animated.Text>
        </View>
      )}

      {/* Kullanıcının mesajını girmesi için input alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Bir şey yaz..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>

      {/* Seçenekler varsa, onları göster */}
      {options.length > 0 && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleOptionSelect(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// React Native stilini oluşturuyoruz
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messagesList: {
    width: '100%',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end', // Kullanıcı mesajı sağda
    backgroundColor: '#007bff',
  },
  botMessage: {
    alignSelf: 'flex-start', // Bot cevabı solda
    backgroundColor: '#e5e5e5', // Gri arka plan
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  botText: {
    color: '#28a745', // Bot cevabı için yeşil renk
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  optionsContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  optionButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginVertical: 5,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  thinkingContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  thinkingText: {
    fontSize: 18,
    color: '#888',
    fontStyle: 'italic',
  },
  listStyle:{

  }
});

export default ChatBot;
