/* eslint-disable react/no-array-index-key */
import { Box, Heading, UnorderedList, ListItem } from "@chakra-ui/react";
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
      <UnorderedList>
        {data.inactiveUIUCStudent.map((x: unknown, i: number) => {
          return <ListItem key={i}>{JSON.stringify(x)}</ListItem>;
        })}
      </UnorderedList>

      <Heading size="md" py={4}>
        Inactive UIUC students
      </Heading>
      <UnorderedList>
        {data.topOffer.map((x: unknown, i: number) => {
          return <ListItem key={i}>{JSON.stringify(x)}</ListItem>;
        })}
      </UnorderedList>
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
