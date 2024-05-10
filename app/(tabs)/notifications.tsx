import React from 'react'
import { ScrollView } from 'moti'
import { Box, Text } from '@gluestack-ui/themed'

const notifications = () => {
  return (
    <ScrollView>
        <Box
            alignItems="center"
            bgColor="$white"
            flexDirection='row'
            paddingVertical={'$5'}
            paddingHorizontal="$10"

        >
            <Box
                width="$2"
                height="$2" 
                borderRadius="$full"
                bgColor="$red400"
            />
            <Box width="$5" />
            <Text>Movimiento Brusco detectado</Text>
            <Box width="$5" />
            <Text>10:25 AM</Text>
        </Box>
    </ScrollView>
  )
}

export default notifications