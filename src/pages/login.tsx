import {
  Flex,
  Box,
  Heading,
  Button,
  FormControl,
  Input,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import router from "next/router";
import { useContext, useState } from "react";

import { BASE_URL } from "../../config";
import UserContext from "context/user";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useContext(UserContext);

  const postData = async () => {
    return fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  };

  return (
    <Flex alignItems="center" justifyContent="center">
      <Box width="auto">
        <Stack spacing={3}>
          <Heading size="md" align="center">
            Login
          </Heading>
          <FormControl id="email">
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button
            width="full"
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              const res = await postData();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const user: any = (await res.json()).data;
              setUserId(user.id);
              router.push("job");
            }}
          >
            Login
          </Button>
          <Box>
            <a>Dont have an account?</a> <Link href="/signup">Sign Up</Link>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Login;
