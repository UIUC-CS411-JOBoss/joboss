import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { BASE_URL } from "../../config";
import { JobItem } from "types/job";

const getRecommand = async (
  user_id: number | undefined,
  job_id: number | undefined
) => {
  return fetch(`${BASE_URL}/api/job/recommand`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      job_id,
    }),
  });
};

type RecommanddProps = {
  job_id: number | undefined;
  user_id: number | undefined;
};

const RecommandView = ({ job_id, user_id }: RecommanddProps) => {
  const [jobList, setJobList] = useState<JobItem[]>([] as JobItem[]);

  useEffect(() => {
    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await (await getRecommand(user_id, job_id)).json();
      setJobList(res.data as JobItem[]);
    })();
  }, [user_id, job_id]);

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Role Name</Th>
          <Th>Company</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {jobList.map((job) => (
          <Tr key={job.id}>
            <Td>{job.title}</Td>
            <Td>{job.company}</Td>
            <Td>
              <Button>Detail</Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default RecommandView;
