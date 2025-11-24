import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';

export default function Timer({ seconds, onFinish }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const timer = useRef(null);

  useEffect(() => {
    setTimeLeft(seconds);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer.current);
          onFinish && onFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [seconds]);

  return (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <Text style={{ fontSize: 28 }}>{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
      <View style={{ height: 8 }} />
      <Button title="Skip" onPress={() => { clearInterval(timer.current); onFinish && onFinish(); }} />
    </View>
  );
}
