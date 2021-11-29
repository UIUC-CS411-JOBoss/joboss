import { Box, Flex, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useContext } from "react";

import UserContext from "context/user";

import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const { userId, setUserId } = useContext(UserContext);
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
      <Box p={2}>
        <Link href="/statistics/">Statistics</Link>
      </Box>
      <Box p={2}>
        <Link href="http://34.83.6.47:3000/public/dashboard/47a82ee9-fadb-4d64-bf7d-a9401fe7cbd7">
          Metabase
        </Link>
      </Box>
      <Box marginLeft="auto">
        {userId ? (
          <Link href="/" passHref>
            <Button mr={4} onClick={() => setUserId(null)}>
              LogOut
            </Button>
          </Link>
        ) : (
          <Link href="/login/" passHref>
            <Button mr={4}>Login</Button>
          </Link>
        )}
        <ThemeToggle />
      </Box>
    </Flex>
  );
};

export default Header;
