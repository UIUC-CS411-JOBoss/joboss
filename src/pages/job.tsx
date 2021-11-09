import {
  Box,
  Table,
  Thead,
  Tbody,
  Button,
  Tr,
  Th,
  Td,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useRef, useState, useEffect } from "react";

import { BASE_URL } from "../../config";
import type { JobItem } from "types/job";

const Job = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [jobList, setJobList] = useState<JobItem[]>(data as JobItem[]);
  const [searchCompany, setSearchCompany] = useState("");
  const [currPage, setCurrPage] = useState(0);

  const changePage = (val: number) => {
    setCurrPage((prevPage: number) =>
      prevPage + val < 0 ? 0 : prevPage + val
    );
  };

  useEffect(() => {
    const fetchJobList = async () => {
      const url = searchCompany
        ? `${BASE_URL}/api/job/list?company=${searchCompany}&page=${currPage}`
        : `${BASE_URL}/api/job/list?page=${currPage}`;
      const res = await fetch(url);
      const jobs = (await res.json()).data;
      setJobList(jobs);
    };
    fetchJobList();
  }, [currPage, searchCompany]);

  return (
    <>
      <Box mb={8} w="full">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Company</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {jobList.map((job) => (
              <Tr>
                <Td>{job.title}</Td>
                <Td>{job.company}</Td>
                <Td>
                  <Stack spacing={4} direction="row" align="center">
                    <Button>Detail</Button>
                    <Button>I Have Applied</Button>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Stack spacing={4} direction="row" align="center" py={4}>
          <Button colorScheme="teal" onClick={() => changePage(-1)}>
            Prev
          </Button>
          <Button colorScheme="teal" onClick={() => changePage(1)}>
            Next
          </Button>
          <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
            Search
          </Button>
        </Stack>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <FormControl id="company">
                <FormLabel>Company Name</FormLabel>
                <Input
                  value={searchCompany}
                  onChange={(e) => setSearchCompany(e.target.value)}
                />
              </FormControl>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={async () => {
                const res = await fetch(
                  `${BASE_URL}/api/job/list?company=${searchCompany}&page=${currPage}`
                );
                const d = await res.json();
                if (d !== null) setJobList(d.data);
              }}
            >
              Search
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${BASE_URL}/api/job/list?page=0`);
  const data = await res.json();

  if (data === null) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      data: data.data as JobItem,
    },
  };
};

export default Job;
