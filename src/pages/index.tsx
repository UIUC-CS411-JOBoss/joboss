import { Box, Heading, UnorderedList, ListItem, Text } from "@chakra-ui/react";
// import { useContext } from "react";

// import UserContext from "context/user";

const Home = () => {
  // const { userId } = useContext(UserContext);
  return (
    <Box mb={8} w="full">
      <Heading py={4}>Disclaimer</Heading>
      <Text> This is the final project for UIUC CS510 SP22.</Text>
      <Text>It is only for educational purpose.</Text>
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
