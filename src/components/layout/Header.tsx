import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <Flex as="header" width="full" align="center">
      <Box p={2}>
        <Text fontWeight="extrabold" fontSize="lg">
          <Link href="/">Joboss</Link>
        </Text>
      </Box>
      <Box p={2}>
        <Link href="/job/">Job</Link>
      </Box>
      <Box p={2}>
        <Link href="/apply/">My Apply</Link>
      </Box>
      <Box marginLeft="auto">
        <ThemeToggle />
      </Box>
    </Flex>
  );
};

export default Header;
