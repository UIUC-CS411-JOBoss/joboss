import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
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
  InputGroup,
  InputLeftElement,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Select,
  Spinner,
  Heading,
  Text,
  Portal,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRef, useState, useEffect, useContext, useCallback } from "react";

import { BASE_URL } from "../../config";
import RecommandViev from "../components/Recommand";
import UserTag from "../components/UserTag";
import { States } from "../utils/statesInUS";
import UserContext from "context/user";
import type { ApplyItem } from "types/apply";
import type { JobItem } from "types/job";
import { getDateString } from "utils/date";

const Job = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { userId } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [jobList, setJobList] = useState<JobItem[]>(data as JobItem[]);
  const [currentJob, setCurrentJob] = useState<JobItem | undefined>(undefined);
  const [searchCompany, setSearchCompany] = useState("");
  const [searchJobType, setSearchJobType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchJD, setSearchJD] = useState("");
  const [searchPreferedTag, setSearchPreferedTag] = useState("true");
  const [currPage, setCurrPage] = useState(0);
  const [action, setAction] = useState<"" | "create" | "search" | "detail">("");
  const [currentApply, setCurrentApply] = useState<ApplyItem | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
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
      // eslint-disable-next-line object-shorthand
      userId: userId,
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

  const fetchJobList = useCallback(async () => {
    const params = {
      company: searchCompany,
      jobType: searchJobType,
      location: searchLocation,
      role: searchRole,
      JobDescription: searchJD,
      onlyPreferedTag: searchPreferedTag,
      page: `${currPage}`,
    };

    const searchParams = new URLSearchParams(params);
    const url = `${BASE_URL}/api/job/list?${searchParams}`;
    const res = await fetch(url);
    const jobs = (await res.json()).data;
    setJobList(jobs);
  }, [
    currPage,
    searchCompany,
    searchJobType,
    searchLocation,
    searchRole,
    searchJD,
    searchPreferedTag,
  ]);

  useEffect(() => {
    setIsLoading(true);
    fetchJobList();
    setIsLoading(false);
  }, [fetchJobList]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
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
            return <Tag key={state}>{state}</Tag>;
          });
        }
        return <Tag>N/A</Tag>;
      };
      return (
        <>
          <DrawerHeader>
            Job Detail - {currentJob?.id}{" "}
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th isNumeric>Applied</Th>
                  <Th isNumeric>OA</Th>
                  <Th isNumeric>Behavior Interview</Th>
                  <Th isNumeric>Technical Interview</Th>
                  <Th isNumeric>Rejected</Th>
                  <Th isNumeric>Offered</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td isNumeric>{currentJob?.applied_count}</Td>
                  <Td isNumeric>{currentJob?.oa_count}</Td>
                  <Td isNumeric>{currentJob?.behavior_interview_count}</Td>
                  <Td isNumeric>{currentJob?.technical_interview_count}</Td>
                  <Td isNumeric>{currentJob?.rejected_count}</Td>
                  <Td isNumeric>{currentJob?.offered_count}</Td>
                </Tr>
              </Tbody>
            </Table>
          </DrawerHeader>
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

              <Heading as="h4" size="md">
                Role description
              </Heading>
              <Text fontSize="md">{currentJob?.text_description} </Text>
              <Heading as="h4" size="md">
                Related Jobs
              </Heading>
              <RecommandViev job_id={currentJob?.id} user_id={0} />
            </Stack>
          </DrawerBody>
        </>
      );
    }
    return null;
  };
  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }
  return (
    <>
      <Box mb={8} w="full">
        <Stack spacing={3}>
          {userId !== null ? (
            <UserTag refetch={fetchJobList} userId={userId} />
          ) : null}
          <FormControl id="company" hidden={isCreate}>
            <FormLabel>Search Company</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
              />
            </InputGroup>
          </FormControl>
          <Stack spacing={2} direction="row" align="center" py={4}>
            <Button
              colorScheme={searchPreferedTag === "" ? "gray" : "blue"}
              onClick={() => {
                setSearchPreferedTag(searchPreferedTag === "" ? "true" : "");
              }}
            >
              Recommend
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button colorScheme={searchJobType === "" ? "gray" : "blue"}>
                  Job Type
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <FormControl id="jobType">
                      <FormLabel>Search Job Type</FormLabel>
                      <Select
                        onChange={(e) => setSearchJobType(e.target.value)}
                        value={searchJobType}
                        placeholder="Select Option"
                      >
                        <option value="Job">Full-Time</option>
                        <option value="Internship">Internship</option>
                        <option value="All">All</option>
                      </Select>
                    </FormControl>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
            <Popover>
              <PopoverTrigger>
                <Button colorScheme={searchLocation === "" ? "gray" : "blue"}>
                  Location
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <FormControl id="location">
                      <FormLabel>Search Location</FormLabel>
                      <Select
                        onChange={(e) => setSearchLocation(e.target.value)}
                        value={searchLocation}
                        placeholder="Select State"
                      >
                        {States.map((state) => {
                          return (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
            <Popover>
              <PopoverTrigger>
                <Button colorScheme={searchRole === "" ? "gray" : "blue"}>
                  Role Name
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <FormControl id="roleName">
                      <FormLabel>Search Role Name</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                          value={searchRole}
                          onChange={(e) => setSearchRole(e.target.value)}
                        />
                      </InputGroup>
                    </FormControl>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
            <Popover>
              <PopoverTrigger>
                <Button colorScheme={searchJD === "" ? "gray" : "blue"}>
                  Job Description
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <FormControl id="jobDescription">
                      <FormLabel>Search Job Description</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                          value={searchJD}
                          onChange={(e) => setSearchJD(e.target.value)}
                        />
                      </InputGroup>
                    </FormControl>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => {
                setSearchCompany("");
                setSearchJobType("");
                setSearchLocation("");
                setSearchRole("");
                setSearchJD("");
                setSearchPreferedTag("");
              }}
            >
              Clear
            </Button>
          </Stack>
        </Stack>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Role Name</Th>
              <Th>Company</Th>
              <Th>Tag</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {jobList.map((job) => (
              <Tr key={job.id}>
                <Td>{job.title}</Td>
                <Td>{job.company}</Td>
                <Td w="200px">
                  <Wrap spacing={2} w="200px">
                    {job.tag_list.split(";").map((t) =>
                      t ? (
                        <WrapItem>
                          <Tag
                            size="sm"
                            key={t}
                            variant="solid"
                            colorScheme="teal"
                          >
                            {t}
                          </Tag>
                        </WrapItem>
                      ) : null
                    )}
                  </Wrap>
                </Td>
                <Td>
                  <Stack spacing={4} direction="row" align="center">
                    <Button ref={btnRef} onClick={() => goDetail(job)}>
                      Detail
                    </Button>
                    <Button
                      hidden={!userId}
                      size="sm"
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
        onClose={() => {
          setIsCreated(false);
          onClose();
        }}
        size={isDetail ? "full" : "sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {drawerHeaderBody()}
          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                setIsCreated(false);
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              hidden={!userId}
              colorScheme="blue"
              onClick={async () => {
                if (isCreate) {
                  setIsCreated(false);
                  await postData("create");
                  fetchJobList();
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
  const res = await fetch(
    `${BASE_URL}/api/job/list?page=0&onlyPreferedTag=true`
  );
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
