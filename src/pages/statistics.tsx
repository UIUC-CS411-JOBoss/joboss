/* eslint-disable react/no-array-index-key */
import {
  Box,
  Heading,
  UnorderedList,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { BASE_URL } from "../../config";

const Statistics = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
          {data.topOffer.map((offer: any) => (
            <Tr key={offer.id}>
              <Td>{offer.name}</Td>
              <Td>{offer.num_of_offer}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Heading size="md" py={4}>
        Inactive UIUC students
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Contact</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.inactiveUIUCStudent.map((user: any) => (
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
