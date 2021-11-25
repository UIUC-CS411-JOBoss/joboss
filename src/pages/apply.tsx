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
import React, { useRef, useState, useEffect, useCallback } from "react";

import { BASE_URL } from "../../config";
import type { ApplyItem } from "types/apply";

const Apply = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [action, setAction] = useState<"" | "create" | "update">("");
  const [applyList, setApplyList] = useState<ApplyItem[]>(data as ApplyItem[]);
  const [currentApply, setCurrentApply] = useState<ApplyItem | undefined>(
    undefined
  );
  const [currPage, setCurrPage] = useState(0);
  const isUpdate = action === "update";

  const changePage = (val: number) => {
    setCurrPage((prevPage: number) =>
      prevPage + val < 0 ? 0 : prevPage + val
    );
  };

  const fetchApplyList = useCallback(async () => {
    const res = await fetch(`${BASE_URL}/api/apply/list?page=${currPage}`);
    const jobs = (await res.json()).data;
    setApplyList(jobs);
  }, [currPage]);

  useEffect(() => {
    fetchApplyList();
  }, [currPage, fetchApplyList]);

  const goUpdate = (applyData: ApplyItem) => {
    setAction("update");
    setCurrentApply(applyData);
    onOpen();
  };

  const postData = async (act: "update" | "delete") => {
    return fetch(`${BASE_URL}/api/apply/${act}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentApply),
    });
  };

  return (
    <>
      <Box w="full">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Company</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {applyList.map((apply) => (
              <Tr>
                <Td>{apply.title}</Td>
                <Td>{apply.company}</Td>
                <Td>{apply.status}</Td>
                <Td>{apply.date}</Td>
                <Td>
                  <Stack spacing={4} direction="row" align="center">
                    <Button ref={btnRef} onClick={() => goUpdate(apply)}>
                      Detail
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
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Update Apply - {currentApply?.id}</DrawerHeader>
          <DrawerBody>
            {currentApply ? (
              <Stack spacing={4}>
                <FormControl id="job id">
                  <FormLabel>Job Id</FormLabel>
                  <Input
                    disabled={isUpdate}
                    onChange={(e) =>
                      setCurrentApply({
                        ...currentApply,
                        jobId: parseInt(e.target.value || "0", 10),
                      })
                    }
                    value={currentApply?.jobId}
                  />
                </FormControl>
                <FormControl id="title">
                  <FormLabel>Title</FormLabel>
                  <Input disabled={isUpdate} value={currentApply?.title} />
                </FormControl>
                <FormControl id="company">
                  <FormLabel>Company Name</FormLabel>
                  <Input disabled={isUpdate} value={currentApply?.company} />
                </FormControl>
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
                      setCurrentApply({ ...currentApply, date: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl id="createAt">
                  <FormLabel>Create At</FormLabel>
                  <Input disabled value={currentApply?.createAt} />
                </FormControl>
                <FormControl id="updateAt">
                  <FormLabel>Update At</FormLabel>
                  <Input disabled value={currentApply?.updateAt} />
                </FormControl>
              </Stack>
            ) : (
              "no data"
            )}
          </DrawerBody>
          <DrawerFooter>
            <Stack spacing={4} direction="row" align="center" py={4}>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await postData("delete");
                  await fetchApplyList();
                  onClose();
                }}
              >
                Delete
              </Button>
              <Button
                colorScheme="blue"
                onClick={async () => {
                  await postData("update");
                  await fetchApplyList();
                }}
              >
                Update
              </Button>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${BASE_URL}/api/apply/list?page=0`);
  const data = await res.json();

  if (data === null) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      data: data.data as ApplyItem,
    },
  };
};

export default Apply;
