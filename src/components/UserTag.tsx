import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  CheckboxGroup,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRef, useEffect, useState, useCallback } from "react";

import { BASE_URL } from "../../config";
import type { TagItem } from "types/tag";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserTag = ({ refetch, userId }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const [tagList, setTagList] = useState<TagItem[] | undefined>(undefined);
  const [selectedTagList, setSelectedTagList] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const fetchTagList = async () => {
    const url = `${BASE_URL}/api/tag/list`;
    const res = await fetch(url);
    const tags = (await res.json()).data;
    setTagList(tags);
  };

  const fetchUserTag = useCallback(async () => {
    const url = `${BASE_URL}/api/tag/user/list?uid=${userId}`;
    const res = await fetch(url);
    const userTags = (await res.json()).data;
    setSelectedTagList(
      userTags.map((userTagItem: TagItem) => {
        return userTagItem.tag;
      })
    );
  }, [userId]);

  useEffect(() => {
    fetchTagList();
    fetchUserTag();
  }, [fetchUserTag]);

  const postData = async () => {
    if (tagList) {
      const tagNameToId = new Map();
      tagList.forEach(({ id, tag }: TagItem) => {
        tagNameToId.set(tag, id);
      });
      const selectedTagIds = selectedTagList
        .map((tag) => {
          return tagNameToId.get(tag);
        })
        .join(",");
      return fetch(`${BASE_URL}/api/tag/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagIds: selectedTagIds, userId }),
      });
    }
    return null;
  };

  return (
    <>
      <Button
        ref={btnRef}
        colorScheme="green"
        width="200px"
        onClick={() => {
          setIsSaved(false);
          fetchUserTag();
          onOpen();
        }}
      >
        My Preferred Skills
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Preferred Skills</DrawerHeader>
          <DrawerBody>
            <CheckboxGroup
              colorScheme="green"
              value={selectedTagList}
              onChange={(tagNameList: string[]) => {
                setSelectedTagList(tagNameList);
              }}
            >
              <SimpleGrid columns={2} spacing={10}>
                {tagList?.map((tag) => {
                  return (
                    <Checkbox value={tag.tag} key={tag.id} colorScheme="green">
                      {tag.tag}
                    </Checkbox>
                  );
                })}
              </SimpleGrid>
            </CheckboxGroup>
          </DrawerBody>
          <DrawerFooter>
            <Stack spacing={4} direction="row" align="center" py={4}>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                isDisabled={isSaved}
                colorScheme="blue"
                onClick={async () => {
                  setIsSaved(false);
                  await postData();
                  refetch();
                  setIsSaved(true);
                }}
              >
                {isSaved ? "Updated" : "Save"}
              </Button>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UserTag;
