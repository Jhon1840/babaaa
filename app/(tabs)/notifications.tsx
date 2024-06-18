import React, { useEffect, useState } from 'react';
import { ScrollView } from 'moti';
import { Box, Text } from '@gluestack-ui/themed';
import { supabase } from '@/utils/supabase';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data);
      }
    };

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView>
      {notifications.map((notification, index) => (
        <Box
          key={index}
          alignItems="center"
          bgColor="$white"
          flexDirection="row"
          paddingVertical="$5"
          paddingHorizontal="$10"
          borderBottomWidth={1}
          borderBottomColor="$gray200"
          justifyContent="space-between"
        >
          <Box flexDirection="row" alignItems="center" flex={1} overflow="hidden">
            <Box
              width="$2"
              height="$2"
              borderRadius="$full"
              bgColor="$red400"
            />
            <Box width="$5" />
            <Text flexShrink={1}>{notification.mensaje}</Text>
          </Box>
          <Text>{new Date(notification.timestamp).toLocaleTimeString()}</Text>
        </Box>
      ))}
    </ScrollView>
  );
};

export default Notifications;
