import { Box, Heading, UnorderedList, ListItem, Text } from "@chakra-ui/react";

const Home = () => {
  return (
    <Box mb={8} w="full">
      <Text> This is the final project for UIUC CS411 FA21.</Text>
      <Text>Disclaimer: It is only for educational purpose.</Text>

      <Heading py={4}>Author</Heading>
      <UnorderedList>
        <ListItem>Hsin-Yu Huang hyhuang3@illinois.edu</ListItem>
        <ListItem>Po-Lin Cho polinlc2@illinois.edu</ListItem>
        <ListItem>Jared Wang ylwang2@illinois.edu</ListItem>
        <ListItem>Kuan-Yin Chen kuanyin2@illinois.edu</ListItem>
      </UnorderedList>
    </Box>
  );
};

export default Home;
