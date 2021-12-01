import {
  Flex,
  Box,
  Heading,
  Button,
  FormControl,
  Input,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { BASE_URL } from "../../config";

const Signup = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const postData = async () => {
    return fetch(`${BASE_URL}/api/auth/signup`, {
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
            Sign Up
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
          <FormControl id="comfirmpassword">
            <Input
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          <Button
            width="full"
            type="submit"
            onClick={async (e) => {
              setLoading(true);
              e.preventDefault();
              if (password !== confirmPassword) {
                return;
              }
              await postData();
              router.push("login");
              setLoading(false);
            }}
          >
            {loading ? <Spinner /> : "Sign Up"}
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Signup;
