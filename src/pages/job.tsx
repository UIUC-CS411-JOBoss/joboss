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
  Textarea,
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
  const [currentJob, setCurrentJob] = useState<JobItem | undefined>(undefined);
  const [searchCompany, setSearchCompany] = useState("");
  const [currPage, setCurrPage] = useState(0);
  const [action, setAction] = useState<"" | "create" | "search" | "detail">("");
  const [currentApply, setCurrentApply] = useState<ApplyItem | undefined>(
    undefined
  );
  const isCreate = action === "create";
  const isSearch = action === "search";
  const isDetail = action === "detail";

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

  const goDetail = (job: JobItem) => {
    setAction("detail");
    setCurrentJob(job);
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

  const drawerHeaderBody = () => {
    if (isCreate && currentApply) {
      return (
        <>
          <DrawerHeader>Create Application</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <FormControl id="status" hidden={isSearch}>
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
                  <option value="behavior interview">behavior interview</option>
                  <option value="technical interview">
                    technical interview
                  </option>
                  <option value="rejected">rejected</option>
                  <option value="offered">offered</option>
                </Select>
              </FormControl>

              <FormControl id="date" hidden={isSearch}>
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
            </Stack>
          </DrawerBody>
        </>
      );
    }

    if (isSearch) {
      return (
        <>
          <DrawerHeader>Search Job</DrawerHeader>
          <DrawerBody>
            <Stack>
              <FormControl id="company" hidden={isCreate}>
                <FormLabel>Company Name</FormLabel>
                <Input
                  value={searchCompany}
                  onChange={(e) => setSearchCompany(e.target.value)}
                />
              </FormControl>
            </Stack>
          </DrawerBody>
        </>
      );
    }
    if (isDetail) {
      return (
        <>
          <DrawerHeader>Job Detail</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <FormControl id="job id">
                <FormLabel>Job Id</FormLabel>
                <Input disabled value={currentJob?.id} />
              </FormControl>
              <FormControl id="title">
                <FormLabel>Title</FormLabel>
                <Input disabled value={currentJob?.title} />
              </FormControl>
              <FormControl id="company">
                <FormLabel>Company Name</FormLabel>
                <Input disabled value={currentJob?.company} />
              </FormControl>
              <FormControl id="locationStates">
                <FormLabel>Location States</FormLabel>
                <Input disabled value={currentJob?.location_states} />
              </FormControl>
              <FormControl id="textDescription">
                <FormLabel>Description</FormLabel>
                <Textarea
                  rows={15}
                  disabled
                  value={currentJob?.text_description}
                />
              </FormControl>
              <FormControl id="applyStart">
                <FormLabel>Application Start Date</FormLabel>
                <Input disabled value={currentJob?.apply_start} />
              </FormControl>
              <FormControl id="expirationDate">
                <FormLabel>Application Expiration Date</FormLabel>
                <Input disabled value={currentJob?.expiration_date} />
              </FormControl>
            </Stack>
          </DrawerBody>
        </>
      );
    }
    return null;
  };

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
              <Tr key={job.id}>
                <Td>{job.title}</Td>
                <Td>{job.company}</Td>
                <Td>
                  <Stack spacing={4} direction="row" align="center">
                    <Button ref={btnRef} onClick={() => goDetail(job)}>
                      Detail
                    </Button>
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
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {drawerHeaderBody()}
          <DrawerFooter hidden={isDetail}>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={async () => {
                if (isCreate) {
                  await postData("create");
                }
                if (isSearch) {
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
