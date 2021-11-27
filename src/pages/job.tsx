import {
  Box,
  Table,
  Thead,
  Tbody,
  Button,
  Tr,
  Th,
  Tag,
  Td,
  Stack,
  HStack,
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
  Heading,
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRef, useState, useEffect } from "react";

import { BASE_URL } from "../../config";
import UserTag from "../components/UserTag";
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
  const [isCreated, setIsCreated] = useState(false);
  const isCreate = action === "create";
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
            {!isCreated ? (
              <Stack spacing={4}>
                <FormControl id="status">
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

                <FormControl id="date">
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
            ) : (
              <Heading as="h4" size="md">
                Successfully Created!
              </Heading>
            )}
          </DrawerBody>
        </>
      );
    }

    if (isDetail) {
      const arrayTagMapping = (s: string | undefined) => {
        if (s) {
          const states: string[] = s.split(";");
          const uniqueStates = states.filter((item, pos) => {
            return states.indexOf(item) === pos;
          });
          return uniqueStates.map((state: string) => {
            return <Tag>{state}</Tag>;
          });
        }
        return <Tag>N/A</Tag>;
      };
      return (
        <>
          <DrawerHeader>Job Detail - {currentJob?.id}</DrawerHeader>
          <DrawerBody>
            <Stack spacing={5}>
              <Heading as="h3" size="lg">
                {currentJob?.title}
              </Heading>
              <Heading as="h4" size="md">
                Company Name
              </Heading>
              <Text fontSize="md">{currentJob?.company}</Text>
              <HStack spacing={10}>
                <Stack spacing={3}>
                  <Heading as="h4" size="md">
                    Application start date
                  </Heading>
                  <Text fontSize="md">
                    {currentJob?.apply_start.slice(0, 10)}
                  </Text>
                </Stack>
                <Stack spacing={3}>
                  <Heading as="h4" size="md">
                    Application deadline
                  </Heading>
                  <Text fontSize="md">
                    {currentJob?.expiration_date.slice(0, 10)}{" "}
                  </Text>
                </Stack>
              </HStack>
              <HStack spacing={10}>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Country
                  </Heading>
                  <HStack spacing={2}>
                    {arrayTagMapping(currentJob?.location_countries)}
                  </HStack>
                </Stack>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    State
                  </Heading>
                  <HStack spacing={2}>
                    {arrayTagMapping(currentJob?.location_states)}
                  </HStack>
                </Stack>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Cities
                  </Heading>
                  <HStack spacing={2}>
                    {arrayTagMapping(currentJob?.location_cities)}
                  </HStack>
                </Stack>
              </HStack>
              <HStack spacing={10}>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Paid Type
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>{currentJob?.salary_type_name}</Tag>
                  </HStack>
                </Stack>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Remote work
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>{currentJob?.remote === 1 ? "Allowed" : "N/A"}</Tag>
                  </HStack>
                </Stack>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Accept CPT/OPT
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>
                      {currentJob?.accepts_opt_cpt_candidates === 1
                        ? "Yes"
                        : "N/A"}
                    </Tag>
                  </HStack>
                </Stack>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Will Sponsor Visa
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>
                      {currentJob?.willing_to_sponsor_candidate === 1
                        ? "Yes"
                        : "N/A"}
                    </Tag>
                  </HStack>
                </Stack>
              </HStack>
              <HStack spacing={10}>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Applied
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>{currentJob?.applied_count}</Tag>
                  </HStack>
                </Stack>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    OA
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>{currentJob?.oa_count}</Tag>
                  </HStack>
                </Stack>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Behavior Interview
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>{currentJob?.behavior_interview_count}</Tag>
                  </HStack>
                </Stack>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Technical Interview
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>{currentJob?.technical_interview_count}</Tag>
                  </HStack>
                </Stack>

                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Rejected
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>{currentJob?.rejected_count}</Tag>
                  </HStack>
                </Stack>
                <Stack spacing={4}>
                  <Heading as="h4" size="md">
                    Offered
                  </Heading>
                  <HStack spacing={4}>
                    <Tag>{currentJob?.offered_count}</Tag>
                  </HStack>
                </Stack>
              </HStack>
              <Heading as="h4" size="md">
                Role description
              </Heading>
              <Text fontSize="md">{currentJob?.text_description} </Text>
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
        <Stack>
          <UserTag />
          <FormControl id="company" hidden={isCreate}>
            <FormLabel>Search Company</FormLabel>
            <Input
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
            />
          </FormControl>
        </Stack>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Role Name</Th>
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
                      Create Status
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
        </Stack>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size={isDetail ? "full" : "sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {drawerHeaderBody()}
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={async () => {
                if (isCreate) {
                  setIsCreated(false);
                  await postData("create");
                  setIsCreated(true);
                }
                if (isDetail && currentJob) {
                  goCreate(currentJob.id);
                }
              }}
            >
              Create Status
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
