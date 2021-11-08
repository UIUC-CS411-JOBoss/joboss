/* eslint-disable react/no-array-index-key */
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  Flex,
  Spacer,
  Input,
  Button,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useState } from "react";

import { BASE_URL } from "../../config";
import type { UserItem } from "types/user";

const Statistics = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [userList, setUserList] = useState<UserItem[]>(
    data.inactiveUIUCStudent as UserItem[]
  );
  const [duration, setDuration] = useState("7");

  const searchInactiveUsers = async () => {
    const res = await fetch(
      `${BASE_URL}/api/statistics/inactiveUIUCStudent/?duration=${duration}`
    );
    const users = (await res.json()).data;
    setUserList(users);
  };

  return (
    <Box mb={8} w="full">
      <Heading size="md" py={4}>
        Top Offer in 2020
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Company</Th>
            <Th>Num of offers</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.topOffer.map((offer: any) => (
              <Tr key={offer.id}>
                <Td>{offer.name}</Td>
                <Td>{offer.num_of_offer}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>

      <Heading size="md" py={4}>
        Inactive UIUC students
      </Heading>
      <FormControl id="user">
        <Flex>
          <Box>
            <Input
              width="7rem"
              placeholder="7"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Box>
          <Box p="2">Duration (days)</Box>
          <Spacer />
          <Box>
            <Button colorScheme="blue" onClick={searchInactiveUsers}>
              Search
            </Button>
          </Box>
        </Flex>
      </FormControl>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Contact</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userList.map((user: UserItem) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.email}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const getStatistics = async (name: string) => {
    const res = await fetch(`${BASE_URL}/api/statistics/${name}`);
    return res.json();
  };

  const l = ["inactiveUIUCStudent", "topOffer"];
  const res = await Promise.all(l.map((x) => getStatistics(x)));
  const data: { [key: string]: unknown } = {};
  l.forEach((x, idx) => {
    data[x] = res[idx].data;
  });

  if (data === null) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      data,
    },
  };
};

export default Statistics;
