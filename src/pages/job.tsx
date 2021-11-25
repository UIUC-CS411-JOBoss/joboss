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
  Select,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useRef, useState, useEffect } from "react";

import { BASE_URL } from "../../config";
import type { ApplyItem } from "types/apply";
import type { JobItem } from "types/job";
import { getDateString } from "utils/date";

const Job = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [jobList, setJobList] = useState<JobItem[]>(data as JobItem[]);
  const [searchCompany, setSearchCompany] = useState("");
  const [currPage, setCurrPage] = useState(0);
  const [action, setAction] = useState<"" | "create" | "search">("");
  const [currentApply, setCurrentApply] = useState<ApplyItem | undefined>(
    undefined
  );
  const isCreate = action === "create";
  const isSearech = action === "search";

  const changePage = (val: number) => {
    setCurrPage((prevPage: number) =>
      prevPage + val < 0 ? 0 : prevPage + val
    );
  };

  const goCreate = (jobId: number) => {
    setAction("create");
    setCurrentApply({
      jobId,
      userId: 1,
      title: "",
      company: "",
      date: getDateString(),
      status: "apply",
    });
    onOpen();
  };

  const goSearch = () => {
    setAction("search");
    onOpen();
  };

  const postData = async (act: "create") => {
    return fetch(`${BASE_URL}/api/apply/${act}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentApply),
    });
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
                    <Button
                      ref={btnRef}
                      colorScheme="blue"
                      onClick={() => goCreate(job.id)}
                    >
                      Create
                    </Button>
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
          <Button ref={btnRef} colorScheme="blue" onClick={goSearch}>
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
          <DrawerHeader>
            {isCreate ? "Create Application" : "Search Job"}
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              {currentApply ? (
                <div>
                  <FormControl id="status" hidden={isSearech}>
                    <FormLabel>Status</FormLabel>
                    <Select
                      placeholder="Select option"
                      value={currentApply?.status}
                      onChange={(e) =>
                        setCurrentApply({
                          ...currentApply,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="applied">Apply</option>
                      <option value="OA">OA</option>
                      <option value="behavior interview">
                        behavior interview
                      </option>
                      <option value="technical interview">
                        technical interview
                      </option>
                      <option value="rejected">rejected</option>
                      <option value="offered">offered</option>
                    </Select>
                  </FormControl>

                  <FormControl id="date" hidden={isSearech}>
                    <FormLabel>Date</FormLabel>
                    <Input
                      value={currentApply?.date}
                      onChange={(e) =>
                        setCurrentApply({
                          ...currentApply,
                          date: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </div>
              ) : (
                "no data"
              )}
              <FormControl id="company" hidden={isCreate}>
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
                if (isCreate) {
                  await postData("create");
                }
                if (isSearech) {
                  const res = await fetch(
                    `${BASE_URL}/api/job/list?company=${searchCompany}&page=${currPage}`
                  );
                  const d = await res.json();
                  if (d !== null) setJobList(d.data);
                }
              }}
            >
              {isCreate ? "Create" : "Search"}
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
